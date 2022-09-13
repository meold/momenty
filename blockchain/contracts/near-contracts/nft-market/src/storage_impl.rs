use crate::*;
use near_contract_standards::storage_management::{
    StorageBalance, StorageBalanceBounds, StorageManagement,
};
use near_sdk::{json_types::U128, require, Balance};

// 1000 bytes
const MIN_STORAGE_BALANCE: Balance = 1000u128 * env::STORAGE_PRICE_PER_BYTE;

impl Contract {
    pub(crate) fn internal_storage_balance_of(
        &self,
        account_id: AccountId,
    ) -> Option<StorageBalance> {
        self.accounts.get(&account_id).map(|acc| StorageBalance {
            total: acc.storage_balance.into(),
            available: U128(
                acc.storage_balance - Balance::from(acc.used_bytes) * env::storage_byte_cost(),
            ),
        })
    }
}

#[near_bindgen]
impl StorageManagement for Contract {
    #[payable]
    #[allow(unused_variables)]
    fn storage_deposit(
        &mut self,
        account_id: Option<AccountId>,
        registration_only: Option<bool>,
    ) -> StorageBalance {
        if let Some(registration_only) = registration_only {
            if registration_only {
                unimplemented!()
            }
        }

        let amount: Balance = env::attached_deposit();
        let account_id = account_id.unwrap_or_else(env::predecessor_account_id);

        let mut account = self.accounts.get(&account_id).unwrap_or_default();
        account.storage_balance += amount;

        require!(
            account.storage_balance >= self.storage_balance_bounds().min.into(),
            format!("Minimum storage deposit is {}", MIN_STORAGE_BALANCE)
        );

        self.accounts.insert(&account_id, &account);

        self.internal_storage_balance_of(account_id).unwrap()
    }

    #[payable]
    #[allow(unused_variables)]
    fn storage_withdraw(&mut self, amount: Option<U128>) -> StorageBalance {
        todo!()
    }

    #[payable]
    #[allow(unused_variables)]
    fn storage_unregister(&mut self, force: Option<bool>) -> bool {
        todo!()
    }

    fn storage_balance_bounds(&self) -> StorageBalanceBounds {
        StorageBalanceBounds {
            min: MIN_STORAGE_BALANCE.into(),
            max: None,
        }
    }

    fn storage_balance_of(&self, account_id: AccountId) -> Option<StorageBalance> {
        self.internal_storage_balance_of(account_id)
    }
}
