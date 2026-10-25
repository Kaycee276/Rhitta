#![no_std]
#![allow(clippy::too_many_arguments)]
use soroban_sdk::{contract, contractevent, contractimpl, contracttype, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Song {
    pub id: String,
    pub title: String,
    pub artist_name: String,
    pub artist: Address,
    pub cover_art: String,
    pub audio_url: String,
    pub genre: String,
    pub duration: u32,
    pub price: i128,
    pub play_count: u32,
}

#[contracttype]
pub enum DataKey {
    Song(String),
    SongIndex(u32),
    SongCount,
    Admin,
}

#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SongPublishedEvent {
    pub artist: Address,
    pub song_id: String,
}

#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SongPlayedEvent {
    pub song_id: String,
    pub play_count: u32,
}

#[contract]
pub struct RhittaMusicContract;

#[contractimpl]
#[allow(clippy::too_many_arguments)]
impl RhittaMusicContract {
    /// Initialize the contract with an admin address.
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::SongCount, &0u32);
    }

    /// Publish a new song on Stellar/Soroban.
    #[allow(clippy::too_many_arguments)]
    pub fn publish_song(
        env: Env,
        artist: Address,
        id: String,
        title: String,
        artist_name: String,
        cover_art: String,
        audio_url: String,
        genre: String,
        duration: u32,
        price: i128,
    ) {
        artist.require_auth();

        let song_key = DataKey::Song(id.clone());
        if env.storage().persistent().has(&song_key) {
            panic!("song with this id already exists");
        }

        let song = Song {
            id: id.clone(),
            title,
            artist_name,
            artist: artist.clone(),
            cover_art,
            audio_url,
            genre,
            duration,
            price,
            play_count: 0,
        };

        let mut count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::SongCount)
            .unwrap_or(0);

        env.storage().persistent().set(&song_key, &song);
        env.storage()
            .persistent()
            .set(&DataKey::SongIndex(count), &id);

        count += 1;
        env.storage().instance().set(&DataKey::SongCount, &count);

        // Emit real-time event for indexing and frontend reactive subscription
        SongPublishedEvent {
            artist,
            song_id: id,
        }
        .publish(&env);
    }

    /// Record a song playback event and increment its on-chain play count.
    pub fn record_play(env: Env, song_id: String) -> u32 {
        let song_key = DataKey::Song(song_id.clone());
        let mut song: Song = env
            .storage()
            .persistent()
            .get(&song_key)
            .expect("song not found");

        song.play_count += 1;
        env.storage().persistent().set(&song_key, &song);

        // Emit play event
        SongPlayedEvent {
            song_id: song_id.clone(),
            play_count: song.play_count,
        }
        .publish(&env);

        song.play_count
    }

    /// Get details of a single song by its unique ID.
    pub fn get_song(env: Env, song_id: String) -> Option<Song> {
        env.storage().persistent().get(&DataKey::Song(song_id))
    }

    /// Get total count of songs published.
    pub fn get_song_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::SongCount)
            .unwrap_or(0)
    }

    /// Retrieve a song by zero-based catalog index.
    pub fn get_song_by_index(env: Env, index: u32) -> Option<Song> {
        let song_id: Option<String> = env.storage().persistent().get(&DataKey::SongIndex(index));
        match song_id {
            Some(id) => env.storage().persistent().get(&DataKey::Song(id)),
            None => None,
        }
    }
}

mod test;
