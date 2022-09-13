use std::collections::HashMap;

use near_contract_standards::non_fungible_token::approval::NonFungibleTokenApprovalReceiver;
use near_contract_standards::non_fungible_token::TokenId;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, UnorderedSet};
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    assert_one_yocto, env, ext_contract, near_bindgen, require, AccountId, Balance,
    BorshStorageKey, Gas, PanicOnDefault, Promise, PromiseError, PromiseOrValue,
};

const GAS_FOR_NFT_TRANSFER_CALLBACK: Gas = Gas(10_000_000_000_000);
const GAS_FOR_NFT_TRANSFER: Gas = Gas(10_000_000_000_000);

mod storage_impl;

#[ext_contract(ext_nft)]
pub trait NftTransfer {
    fn nft_transfer(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: Option<u64>,
        memo: Option<String>,
    );
}

#[derive(BorshSerialize, BorshDeserialize, Default)]
pub struct Account {
    pub used_bytes: u64,
    pub storage_balance: Balance,
    //pub listing_ids: UnorderedSet<ListingId>, // TODO
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct ListingId {
    pub nft_contract_id: AccountId,
    pub nft_token_id: TokenId,
}

impl ListingId {
    fn new(nft_contract_id: AccountId, nft_token_id: TokenId) -> Self {
        Self {
            nft_contract_id,
            nft_token_id,
        }
    }
}

impl ToString for ListingId {
    fn to_string(&self) -> String {
        format!("{}@{}", self.nft_contract_id, self.nft_token_id)
    }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Listing {
    pub owner_id: AccountId,
    pub approval_id: u64,
    pub price: U128,
}

impl Listing {
    fn new(owner_id: AccountId, approval_id: u64, price: U128) -> Self {
        Self {
            owner_id,
            approval_id,
            price,
        }
    }
}

#[derive(BorshStorageKey, BorshSerialize)]
pub enum StorageKey {
    Accounts,
    Listings,
    NFTContractIds,
}

#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize, PanicOnDefault)]
pub struct Contract {
    pub owner_id: AccountId,
    pub approved_nft_contract_ids: UnorderedSet<AccountId>,
    pub accounts: UnorderedMap<AccountId, Account>,
    pub listings: UnorderedMap<ListingId, Listing>,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(
        owner_id: Option<AccountId>,
        approved_nft_contract_ids: Option<Vec<AccountId>>,
    ) -> Self {
        let mut this = Self {
            owner_id: owner_id.unwrap_or_else(env::predecessor_account_id),
            accounts: UnorderedMap::new(StorageKey::Accounts),
            listings: UnorderedMap::new(StorageKey::Listings),
            approved_nft_contract_ids: UnorderedSet::new(StorageKey::NFTContractIds),
        };
        if let Some(ids) = approved_nft_contract_ids {
            this.approved_nft_contract_ids.extend(ids.into_iter())
        }
        this
    }

    pub fn approve_nft_contracts(&mut self, nft_contract_ids: Vec<AccountId>) {
        self.approved_nft_contract_ids
            .extend(nft_contract_ids.into_iter())
    }

    pub(crate) fn list_nft(
        &mut self,
        nft_contract_id: AccountId,
        nft_token_id: TokenId,
        owner_id: AccountId,
        approval_id: u64,
        price: U128,
    ) {
        let listing_id = ListingId::new(nft_contract_id, nft_token_id);
        require!(self.listings.get(&listing_id).is_none(), "Already listed");

        let initial_storage_usage = env::storage_usage();
        self.listings.insert(
            &listing_id,
            &Listing::new(owner_id.clone(), approval_id, price),
        );

        let mut account = self.accounts.get(&owner_id).expect("Account not found");
        account.used_bytes += env::storage_usage() - initial_storage_usage;
        self.accounts.insert(&owner_id, &account);

        require!(
            account.storage_balance as Balance
                >= account.used_bytes as Balance * env::storage_byte_cost(),
            "Not enough storage deposit"
        );
    }

    #[payable]
    pub fn update_listing(
        &mut self,
        nft_contract_id: AccountId,
        nft_token_id: TokenId,
        approval_id: Option<u64>,
        price: Option<U128>,
    ) {
        assert_one_yocto();
        let listing_id = ListingId::new(nft_contract_id, nft_token_id);
        let listing = self.listings.get(&listing_id).expect("Not listed");
        let sender_id = env::predecessor_account_id();
        require!(sender_id == listing.owner_id, "Only token owner");
        require!(
            approval_id.is_some() || price.is_some(),
            "Nothing to change"
        );
        self.listings.insert(
            &listing_id,
            &Listing::new(
                listing.owner_id,
                approval_id.unwrap_or(listing.approval_id),
                price.unwrap_or(listing.price),
            ),
        );
    }

    #[payable]
    pub fn cancel_listing(&mut self, nft_contract_id: AccountId, nft_token_id: TokenId) {
        assert_one_yocto();
        let listing_id = ListingId::new(nft_contract_id, nft_token_id);
        let listing = self.listings.get(&listing_id).expect("Not listed");
        let sender_id = env::predecessor_account_id();
        require!(sender_id == listing.owner_id, "Only token owner");

        let initial_storage_usage = env::storage_usage();
        self.listings.remove(&listing_id);

        let mut account = self.accounts.get(&sender_id).expect("Account not found");
        account.used_bytes -= initial_storage_usage - env::storage_usage();
        self.accounts.insert(&sender_id, &account);
    }

    #[payable]
    pub fn buy_nft(&mut self, nft_contract_id: AccountId, nft_token_id: TokenId) -> Promise {
        let listing_id = ListingId::new(nft_contract_id.clone(), nft_token_id.clone());
        let listing = self.listings.get(&listing_id).expect("Not listed");
        require!(
            env::attached_deposit() > listing.price.into(),
            "Attached deposit should be at least 1 yocto more than the price"
        );

        require!(
            self.accounts.get(&listing.owner_id).is_some(),
            "Seller's account not found" // this panic should be impossible
        );

        let buyer_id = env::predecessor_account_id();

        // refund excess amount
        let refund = env::attached_deposit() - Balance::from(listing.price) - 1;
        if refund > 0 {
            Promise::new(buyer_id.clone()).transfer(refund);
        }

        // transfer nft to sender_id
        ext_nft::ext(nft_contract_id.clone())
            .with_static_gas(GAS_FOR_NFT_TRANSFER)
            .with_attached_deposit(1)
            .nft_transfer(
                buyer_id.clone(),
                nft_token_id.clone(),
                Some(listing.approval_id),
                None, // TODO: add sell memo
            )
            .then(
                Self::ext(env::current_account_id())
                    .with_static_gas(GAS_FOR_NFT_TRANSFER_CALLBACK)
                    .nft_transfer_callback(buyer_id, nft_contract_id, nft_token_id, listing),
            )
    }

    #[private]
    pub fn nft_transfer_callback(
        &mut self,
        buyer_id: AccountId,
        nft_contract_id: AccountId,
        nft_token_id: TokenId,
        listing: Listing,
        #[callback_result] result: Result<(), PromiseError>,
    ) -> Promise {
        if result.is_err() {
            // transfer NEAR back to buyer
            return Promise::new(buyer_id).transfer(listing.price.into());
        }

        // remove listing
        let initial_storage_usage = env::storage_usage();
        self.listings
            .remove(&ListingId::new(nft_contract_id, nft_token_id));
        let bytes_released = initial_storage_usage - env::storage_usage();

        // !! we should not panic here
        if let Some(mut seller_acc) = self.accounts.get(&listing.owner_id) {
            seller_acc.used_bytes = seller_acc.used_bytes.saturating_sub(bytes_released);
            self.accounts.insert(&listing.owner_id, &seller_acc);
        }

        // transfer NEAR to seller
        Promise::new(listing.owner_id).transfer(listing.price.into())
    }

    pub fn get_listing(&self, nft_contract_id: AccountId, nft_token_id: TokenId) -> Listing {
        self.listings
            .get(&ListingId::new(nft_contract_id, nft_token_id))
            .expect("Listing not found")
    }

    pub fn get_listings(
        &self,
        from_index: Option<u64>,
        limit: Option<u64>,
    ) -> HashMap<String, Listing> {
        self.listings
            .iter()
            .skip(from_index.unwrap_or_default() as usize)
            .take(limit.unwrap_or_else(|| self.listings.len()) as usize)
            .map(|(listing_id, listing)| (listing_id.to_string(), listing))
            .collect()
    }
}

#[derive(Deserialize)]
#[serde(crate = "near_sdk::serde")]
#[serde(rename_all = "snake_case")]
#[serde(tag = "action")]
enum MarketMessage {
    // {"action": "list", "price": "1000000000000000000000000"}
    List { price: U128 },
}

#[near_bindgen]
impl NonFungibleTokenApprovalReceiver for Contract {
    fn nft_on_approve(
        &mut self,
        token_id: TokenId,
        owner_id: AccountId,
        approval_id: u64,
        msg: String,
    ) -> PromiseOrValue<String> {
        let nft_contract_id = env::predecessor_account_id();
        let signer_id = env::signer_account_id();
        let nft_token_id = token_id;
        require!(
            env::current_account_id() != nft_contract_id,
            "nft_on_approve should only be called via cross-contract call"
        );
        require!(owner_id == signer_id, "owner_id should be signer_id");
        require!(
            self.approved_nft_contract_ids.contains(&nft_contract_id),
            "nft_contract_id is not approved"
        );

        match near_sdk::serde_json::from_str(&msg).expect("Invalid message") {
            MarketMessage::List { price } => {
                self.list_nft(nft_contract_id, nft_token_id, owner_id, approval_id, price);
            }
        }

        PromiseOrValue::Value("".to_string())
    }
}
