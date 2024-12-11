use starknet::ContractAddress;

use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

use event_manager::contract::ISongPlayerDispatcher;
use event_manager::contract::ISongPlayerDispatcherTrait;

fn deploy_song_player() -> (ISongPlayerDispatcher, ContractAddress) {
    let contract = declare("song_player_contract").unwrap().contract_class();

    let (contract_address, _) = contract.deploy(@array![]).unwrap();

    let dispatcher = ISongPlayerDispatcher { contract_address };

    (dispatcher, contract_address)
}

#[test]
fn test_add_song() {
    let (dispatcher, _) = deploy_song_player();
    dispatcher.add_song(78);
    assert_eq!(dispatcher.get_plays(78), 0);
    dispatcher.play_song(78);
    assert_eq!(dispatcher.get_plays(78), 1);
}
// #[test]
// fn test_play_songs {
//     let contract_address = deploy_contract("song_player_contract");

//     let dispatcher = IHelloStarknetDispatcher { contract_address };

//     let balance_before = dispatcher.get_balance();
//     assert(balance_before == 0, 'Invalid balance');

//     dispatcher.increase_balance(42);

//     let balance_after = dispatcher.get_balance();
//     assert(balance_after == 42, 'Invalid balance');
// }

// #[test]
// #[feature("safe_dispatcher")]
// fn test_cannot_increase_balance_with_zero_value() {
//     let contract_address = deploy_contract("HelloStarknet");

//     let safe_dispatcher = IHelloStarknetSafeDispatcher { contract_address };

//     let balance_before = safe_dispatcher.get_balance().unwrap();
//     assert(balance_before == 0, 'Invalid balance');

//     match safe_dispatcher.increase_balance(0) {
//         Result::Ok(_) => core::panic_with_felt252('Should have panicked'),
//         Result::Err(panic_data) => {
//             assert(*panic_data.at(0) == 'Amount cannot be 0', *panic_data.at(0));
//         }
//     };
// }


