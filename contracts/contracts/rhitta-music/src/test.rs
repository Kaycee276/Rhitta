#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

#[test]
fn test_publish_and_play() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(RhittaMusicContract, ());
    let client = RhittaMusicContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.init(&admin);

    let artist = Address::generate(&env);
    let song_id = String::from_str(&env, "track-1");
    let title = String::from_str(&env, "Cosmic Melody");
    let artist_name = String::from_str(&env, "Stella");
    let cover_art = String::from_str(&env, "https://example.com/cover.jpg");
    let audio_url = String::from_str(&env, "https://example.com/audio.mp3");
    let genre = String::from_str(&env, "Electronic");

    client.publish_song(
        &artist,
        &song_id,
        &title,
        &artist_name,
        &cover_art,
        &audio_url,
        &genre,
        &180,
        &10000000,
    );

    assert_eq!(client.get_song_count(), 1);

    let fetched = client.get_song(&song_id).unwrap();
    assert_eq!(fetched.title, title);
    assert_eq!(fetched.play_count, 0);

    let new_count = client.record_play(&song_id);
    assert_eq!(new_count, 1);

    let updated = client.get_song(&song_id).unwrap();
    assert_eq!(updated.play_count, 1);
}
