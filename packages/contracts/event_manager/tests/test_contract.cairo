use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

use event_manager::contract::ISongPlayerDispatcher;
use event_manager::contract::ISongPlayerDispatcherTrait;

fn deploy_song_player() -> ISongPlayerDispatcher {
    let contract_class = declare("song_player_contract").unwrap().contract_class();

    let (contract_address, _) = contract_class.deploy(@array![]).unwrap();

    let dispatcher = ISongPlayerDispatcher { contract_address };

    dispatcher
}

#[test]
fn test_add_song() {
    let dispatcher = deploy_song_player();
    dispatcher.add_song(78);
    assert_eq!(dispatcher.get_plays(78), 0);
    dispatcher.play_song(78);
    assert_eq!(dispatcher.get_plays(78), 1);
}

#[test]
fn test_non_registered_song() {
    let dispatcher = deploy_song_player();
    assert_eq!(dispatcher.get_plays(79), 0);
    dispatcher.play_song(79);
    assert_eq!(dispatcher.get_plays(79), 1);
}
