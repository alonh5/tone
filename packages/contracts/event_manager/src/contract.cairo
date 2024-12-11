#[starknet::interface]
pub trait ISongPlayer<T> {
    fn play_song(ref self: T, song_hash: felt252);
    fn add_song(ref self: T, song_hash: felt252);
    fn get_plays(self: @T, song_hash: felt252) -> u64;
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
        fn play_song(ref self: ContractState, song_hash: felt252) {
            let curr = self.songs.entry(song_hash).read();
            self.songs.entry(song_hash).write(curr + 1);
        }

        fn add_song(ref self: ContractState, song_hash: felt252) {
            self.songs.entry(song_hash).write(0);
        }

        fn get_plays(self: @ContractState, song_hash: felt252) -> u64 {
            self.songs.entry(song_hash).read()
        }
    }
}
