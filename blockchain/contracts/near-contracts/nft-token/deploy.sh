

export NEAR_ENV=testnet
export MOMENTY=momentyio.testnet
export NFT=nft2.momentyio.testnet
export MARKET=market.momentyio.testnet
near create-account $NFT --masterAccount $MOMENTY --initialBalance 20
near create-account $MARKET --masterAccount $MOMENTY --initialBalance 20

near deploy $NFT target/wasm32-unknown-unknown/release/momenty_nft.wasm new '{}'
near deploy $MARKET ../nft-market/target/wasm32-unknown-unknown/release/momenty_market.wasm new '{"approved_nft_contract_ids":["'$NFT'"]}'

near view $NFT nft_metadata
near call $NFT nft_mint '{"token_id":"0", "token_metadata":{"title":"First moment"}}' --accountId $MOMENTY --deposit 1


near view $NFT nft_token '{"token_id":"0"}'
near view $NFT nft_tokens

near call $MARKET storage_deposit --accountId $MOMENTY --deposit 1

near call $NFT nft_approve '{"token_id": "0", "account_id": "'$MARKET'", "msg": "{\"action\": \"list\", \"price\": \"1000000000000000000000000\"}"}' --accountId $MOMENTY --deposit 1
near call $NFT nft_approve '{"token_id": "0", "account_id": "'$MARKET'", "msg": "{\"action\": \"list\", \"price\": \"1000000000000000000000000\"}"}' --accountId $MARKET --deposit 1


near view $NFT storage_balance_of '{"account_id":"'$MARKET'"}'


near view $MARKET storage_balance_of '{"account_id":"'$MOMENTY'"}'

near view $MARKET get_listings

near call $MARKET buy_nft '{"nft_contract_id":"'$NFT'", "nft_token_id":"0"}' --accountId dumbster.testnet --deposit 2


# ---

near call $MARKET storage_deposit --accountId $MARKET --deposit 1

near call $MARKET approve_nft_contracts '{"nft_contract_ids":["'$NFT'"]}' --accountId $MARKET


# ---

export NEAR_ENV=testnet
export SELLER=momentyio.testnet
export BUYER=dubster.testnet
export NFT=nft2.momentyio.testnet
export MARKET=market.momentyio.testnet

# Attached deposit 1 NEAR to cover storage with excess. Excess amount is refunded
near call $NFT nft_mint '{"token_metadata":{"title":"First moment"}}' --accountId $SELLER --deposit 1 

near view $NFT nft_tokens

# Deposit 1 NEAR for storage on market
near call $MARKET storage_deposit --accountId $SELLER --deposit 1

near view $NFT storage_balance_of '{"account_id":"'$SELLER'"}'

# Attached deposit 1 NEAR for approval storage & key checkup
near call $NFT nft_approve '{"token_id": "0", "account_id": "'$MARKET'", "msg": "{\"action\": \"list\", \"price\": \"1000000000000000000000000\"}"}' --accountId $SELLER --deposit 1

near view $MARKET get_listings

# Attached deposit 2 NEAR to cover the token price with excess. Excess amount is refunded. Listing is removed after successful sale
near call $MARKET buy_nft '{"nft_contract_id":"'$NFT'", "nft_token_id":"0"}' --accountId $BUYER --deposit 2

near view $NFT nft_tokens
near view $MARKET get_listings





