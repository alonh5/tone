#[starknet::interface]
pub trait ISongPlayer<T> {
    fn play_song(ref self: T, song_name: felt252);
    fn add_song(ref self: T, song_name: felt252);
    fn get_plays(self: @T, song_name: felt252) -> u64;
    fn collect_payments(ref self: T);
    fn subscribe(ref self: T);
}


#[starknet::contract]
pub mod song_player_contract {
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map, Vec
    };
    use starknet::storage::MutableVecTrait;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use super::ISongPlayer;

    #[storage]
    struct Storage {
        token_dispatcher: IERC20Dispatcher,
        song_owners_and_plays: Map<felt252, (ContractAddress, u64)>,
        song_names: Vec<felt252>,
        subscribers: Map<ContractAddress, u64>,
        total_plays: u64,
    }

    #[constructor]
    pub fn constructor(ref self: ContractState) {
        self
            .token_dispatcher
            .write(
                IERC20Dispatcher {
                    contract_address: 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
                        .try_into()
                        .unwrap()
                }
            );
    }


    #[abi(embed_v0)]
    impl SongPlayerImpl of ISongPlayer<ContractState> {
        fn play_song(ref self: ContractState, song_name: felt252) {
            let caller = get_caller_address();
            let is_subscribed = self.subscribers.entry(caller).read();
            assert(is_subscribed == 1, 'unsubscribed user called');
            let (owner, plays) = self.song_owners_and_plays.entry(song_name).read();
            self.song_owners_and_plays.entry(song_name).write((owner, plays + 1));
            self.total_plays.write(self.total_plays.read() + 1);
        }

        fn add_song(ref self: ContractState, song_name: felt252) {
            self.song_names.append().write(song_name);
            let owner = get_caller_address();
            self.song_owners_and_plays.entry(song_name).write((owner, 0));
        }

        fn get_plays(self: @ContractState, song_name: felt252) -> u64 {
            let (_, plays) = self.song_owners_and_plays.entry(song_name).read();
            plays
        }

        fn collect_payments(ref self: ContractState) {
            let token_dispatcher = self.token_dispatcher.read();
            let contract_balance = token_dispatcher.balance_of(get_contract_address());
            for i in 0
                ..self
                    .song_names
                    .len() {
                        let cur_song = self.song_names.at(i).read();
                        let (owner, plays) = self.song_owners_and_plays.entry(cur_song).read();
                        token_dispatcher
                            .transfer(
                                owner,
                                (contract_balance * plays.into()) / self.total_plays.read().into()
                            );
                        self.song_owners_and_plays.entry(cur_song).write((owner, 0));
                    };
            self.total_plays.write(0);
        }

        fn subscribe(ref self: ContractState) {
            // Add the subscriber.
            let caller = get_caller_address();
            self.subscribers.entry(caller).write(1);

            // Charge.
            let token_dispatcher = self.token_dispatcher.read();
            token_dispatcher.transfer(get_contract_address(), 1);
        }
    }
}
