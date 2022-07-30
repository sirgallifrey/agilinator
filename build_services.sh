#!/bin/bash

( cd services && cargo lambda build --release --arm64 --output-format zip )
