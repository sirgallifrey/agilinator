# syntax=docker/dockerfile:1.3

from rust:1-slim-buster as workspace-fetch

workdir /app
copy services/Cargo.* ./services/
workdir /app/services

# user service
run cargo new --bin srv_user
copy services/srv_user/Cargo.* ./srv_user/

run cargo fetch

# workdir /app
# copy --from=workspace-fetch services/ services/
# copy --from=workspace-fetch /usr/local/cargo /usr/local/cargo

# crates

# services

from rust:1-slim-buster as user-build-deps

workdir /app
copy --from=workspace-fetch /app/services/ services/
copy --from=workspace-fetch /usr/local/cargo /usr/local/cargo
workdir /app/services
run cargo build --release --package srv_user
run rm srv_user/src/*.rs
run ls target/release/
run rm target/release/deps/srv_user*

from rust:1-slim-buster as user-build

workdir /app
copy --from=user-build-deps /app/services/ services/
copy --from=user-build-deps /usr/local/cargo /usr/local/cargo
copy services/srv_user/src/ services/srv_user/src/
workdir /app/services
run cargo build --release --package srv_user

from rust:1-slim-buster as user

workdir /app
copy --from=user-build /app/services/target/release/srv_user .
cmd ["./srv_user"]
