use starknet::ContractAddress;
#[starknet::interface]
pub trait ISongPlayer<T> {
    fn play_song(ref self: T, song_name: felt252);
    fn add_song(ref self: T, song_name: felt252, owner: ContractAddress);
    fn get_plays(self: @T, song_name: felt252) -> u64;
    fn pay_for_song(ref self: T, song_name: felt252);
}


#[starknet::contract]
pub mod song_player_contract {
    use starknet::ContractAddress;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map
    };
    use super::ISongPlayer;


    #[storage]
    struct Storage {
        songs: Map<felt252, (ContractAddress, u64)>,
    }


    #[abi(embed_v0)]
    impl SongPlayerImpl of ISongPlayer<ContractState> {
        fn play_song(ref self: ContractState, song_name: felt252) {
            let (owner, plays) = self.songs.entry(song_name).read();
            self.songs.entry(song_name).write((owner, plays + 1));
            // TODO: Charge the user for the play.
        }

        fn add_song(ref self: ContractState, song_name: felt252, owner: ContractAddress) {
            self.songs.entry(song_name).write((owner, 0));
        }

        fn get_plays(self: @ContractState, song_name: felt252) -> u64 {
            let (_, plays) = self.songs.entry(song_name).read();
            plays
        }

        fn pay_for_song(ref self: ContractState, song_name: felt252) {
            let (owner, _plays) = self.songs.entry(song_name).read();
            // TODO: Transfer money to the owner.
            self.songs.entry(song_name).write((owner, 0));
        }
    }
}
