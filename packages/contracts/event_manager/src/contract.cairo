#[starknet::interface]
pub trait ISongPlayer<T> {
    fn play_song(ref self: T, song_name: felt252);
    fn add_song(ref self: T, song_name: felt252);
    fn get_plays(self: @T, song_name: felt252) -> u64;
}


#[starknet::contract]
pub mod song_player_contract {
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map,
    };
    use super::ISongPlayer;

    #[storage]
    struct Storage {
        songs: Map<felt252, u64>,
    }


    #[abi(embed_v0)]
    impl SongPlayerImpl of ISongPlayer<ContractState> {
        fn play_song(ref self: ContractState, song_name: felt252) {
            let plays = self.songs.entry(song_name).read();
            self.songs.entry(song_name).write(plays + 1);
        }

        fn add_song(ref self: ContractState, song_name: felt252) {
            self.songs.entry(song_name).write(0);
        }

        fn get_plays(self: @ContractState, song_name: felt252) -> u64 {
            self.songs.entry(song_name).read()
        }
    }
}
