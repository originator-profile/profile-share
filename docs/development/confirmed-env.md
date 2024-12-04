# 動作確認済み環境

2024年12月3日時点で開発者が動作確認済みの環境の一覧です。[envinfo](https://github.com/tabrindle/envinfo)の出力結果を記載しています。半年に一度内容を更新します。

ここでの動作確認済みとは、[開発ガイド](./index.mdx)の手順を実行し動作（開発用サーバーとWebブラウザーが起動）することを指します。

## 1

```
  System:
    OS: Linux 6.8 Ubuntu 24.04.1 LTS 24.04.1 LTS (Noble Numbat)
    CPU: (12) x64 13th Gen Intel(R) Core(TM) i7-1365U
    Memory: 20.49 GB / 31.00 GB
    Container: Yes
    Shell: 5.2.21 - /bin/bash
  Binaries:
    Node: 22.11.0 - /usr/bin/node
    Yarn: 1.22.19 - ~/.local/bin/yarn
    npm: 10.9.0 - /usr/bin/npm
    pnpm: 9.12.3 - ~/.local/bin/pnpm
    bun: 1.1.34 - ~/.local/bin/bun
  Managers:
    Apt: 2.7.14 - /usr/bin/apt
    Cargo: 1.82.0 - ~/.cargo/bin/cargo
    Homebrew: 4.4.4 - /home/linuxbrew/.linuxbrew/bin/brew
  Utilities:
    Make: 4.3 - /usr/bin/make
    GCC: 13.2.0 - /usr/bin/gcc
    Git: 2.43.0 - /usr/bin/git
    FFmpeg: 6.1.1 - /usr/bin/ffmpeg
    Curl: 8.5.0 - /usr/bin/curl
    OpenSSL: 3.0.13 - /usr/bin/openssl
  Virtualization:
    Docker: 27.3.1 - /usr/bin/docker
  IDEs:
    Nano: 7.2 - /usr/bin/nano
    VSCode: 1.95.1 - /usr/bin/code
  Languages:
    Bash: 5.2.21 - /usr/bin/bash
    Go: 1.23.2 - /home/linuxbrew/.linuxbrew/bin/go
    Perl: 5.38.2 - /usr/bin/perl
    Python: 3.12.3 - /usr/bin/python
    Python3: 3.12.3 - /usr/bin/python3
    Rust: 1.82.0 - ~/.cargo/bin/rustc
  Databases:
    SQLite: 3.45.1 - /usr/bin/sqlite3
  Browsers:
    Chrome: 130.0.6723.91
```

## 2

```
  System:
    OS: macOS 15.1
    CPU: (8) arm64 Apple M2
    Memory: 3.36 GB / 24.00 GB
    Shell: 5.9 - /bin/zsh
  Binaries:
    Node: 22.11.0 - ~/.local/share/mise/installs/node/22.11.0/bin/node
    npm: 10.9.0 - ~/.local/share/mise/installs/node/22.11.0/bin/npm
    pnpm: 9.12.0 - ~/.local/share/mise/installs/node/22.11.0/bin/pnpm
  Managers:
    Homebrew: 4.4.4 - /opt/homebrew/bin/brew
    pip3: 24.1.2 - ~/.local/share/mise/installs/python/3.13.0/bin/pip3
    RubyGems: 3.0.3.1 - /usr/bin/gem
  Utilities:
    Make: 3.81 - /usr/bin/make
    GCC: 16.0.0 - /usr/bin/gcc
    Git: 2.39.5 - /usr/bin/git
    Clang: 16.0.0 - /usr/bin/clang
    Curl: 8.7.1 - /usr/bin/curl
    OpenSSL: 3.3.6 - /usr/bin/openssl
  Servers:
    Apache: 2.4.62 - /usr/sbin/apachectl
  Virtualization:
    Docker: 27.2.0 - /usr/local/bin/docker
  IDEs:
    VSCode: 1.95.1 - /opt/homebrew/bin/code
    Vim: 9.0 - /usr/bin/vim
    Xcode: /undefined - /usr/bin/xcodebuild
  Languages:
    Bash: 3.2.57 - /bin/bash
    Go: 1.23.2 - ~/.local/share/mise/installs/go/1.23.2/bin/go
    Perl: 5.34.1 - /usr/bin/perl
    PHP: 8.3.13 - /opt/homebrew/bin/php
    Python: 3.13.0 - ~/.local/share/mise/installs/python/3.13.0/bin/python
    Python3: 3.13.0 - ~/.local/share/mise/installs/python/3.13.0/bin/python3
    Ruby: 2.6.10 - /usr/bin/ruby
  Databases:
    SQLite: 3.43.2 - /usr/bin/sqlite3
  Browsers:
    Chrome: 130.0.6723.92
    Edge: 130.0.2849.68
    Safari: 18.1
```

## 3

```
  System:
    OS: macOS 15.0.1
    CPU: (8) arm64 Apple M2
    Memory: 76.92 MB / 24.00 GB
    Shell: 5.9 - /bin/zsh
  Binaries:
    Node: 20.13.1 - ~/.local/share/mise/installs/node/20/bin/node
    npm: 10.5.2 - ~/.local/share/mise/installs/node/20/bin/npm
    pnpm: 9.12.0 - ~/.local/share/mise/installs/node/20/bin/pnpm
  Managers:
    Cargo: 1.81.0 - ~/.local/share/mise/installs/rust/1.81.0/bin/cargo
    CocoaPods: 1.11.3 - /usr/local/bin/pod
    Homebrew: 4.4.2 - /opt/homebrew/bin/brew
    pip2: 20.1.1 - /usr/local/bin/pip2
    pip3: 24.0 - ~/.local/share/mise/installs/python/latest/bin/pip3
    RubyGems: 3.0.3.1 - /usr/bin/gem
  Utilities:
    CMake: 3.30.3 - /opt/homebrew/bin/cmake
    Make: 3.81 - /usr/bin/make
    GCC: 15.0.0 - /usr/bin/gcc
    Git: 2.39.3 - /usr/bin/git
    Clang: 15.0.0 - /usr/bin/clang
    FFmpeg: 7.1 - /opt/homebrew/bin/ffmpeg
    Curl: 8.7.1 - /usr/bin/curl
    OpenSSL: 3.4.0 - /opt/homebrew/bin/openssl
  Servers:
    Apache: 2.4.59 - /usr/sbin/apachectl
  Virtualization:
    Docker: 27.2.0 - /usr/local/bin/docker
  SDKs:
    iOS SDK:
      Platforms: DriverKit 23.5, iOS 17.5, macOS 14.5, tvOS 17.5, visionOS 1.2, watchOS 10.5
  IDEs:
    VSCode: 1.95.1 - /opt/homebrew/bin/code
    Vim: 9.0 - /usr/bin/vim
    Xcode: 15.4/15F31d - /usr/bin/xcodebuild
  Languages:
    Bash: 3.2.57 - /bin/bash
    Go: 1.22.3 - ~/.local/share/mise/installs/go/1.22.3/bin/go
    Java: 1.8.0_292 - /usr/bin/javac
    Perl: 5.34.1 - /usr/bin/perl
    Protoc: 28.2 - /opt/homebrew/bin/protoc
    Python: 3.12.3 - ~/.local/share/mise/installs/python/latest/bin/python
    Python3: 3.12.3 - ~/.local/share/mise/installs/python/latest/bin/python3
    Ruby: 2.6.10 - /usr/bin/ruby
    Rust: 1.81.0 - ~/.local/share/mise/installs/rust/1.81.0/bin/rustc
  Databases:
    PostgreSQL: 14.13 - /opt/homebrew/bin/postgres
    SQLite: 3.43.2 - /usr/bin/sqlite3
  Browsers:
    Brave Browser: 130.1.71.121
    Chrome: 130.0.6723.92
    Safari: 18.0.1
```

## 4

```
  System:
    OS: Linux 6.8 Ubuntu 22.04.5 LTS 22.04.5 LTS (Jammy Jellyfish)
    CPU: (4) x64 AMD Ryzen 9 3950X 16-Core Processor
    Memory: 2.90 GB / 7.71 GB
    Container: Yes
    Shell: 5.1.16 - /bin/bash
  Binaries:
    Node: 20.18.0 - /run/user/1000/fnm_multishells/1338849_1730895378422/bin/node
    npm: 10.8.2 - /run/user/1000/fnm_multishells/1338849_1730895378422/bin/npm
    pnpm: 9.12.0 - /run/user/1000/fnm_multishells/1338849_1730895378422/bin/pnpm
  Managers:
    Apt: 2.4.13 - /usr/bin/apt
    Cargo: 1.81.0 - ~/.cargo/bin/cargo
  Utilities:
    Make: 4.3 - /usr/bin/make
    GCC: 11.4.0 - /usr/bin/gcc
    Git: 2.34.1 - /usr/bin/git
    FFmpeg: 4.4.2 - /usr/bin/ffmpeg
    Curl: 7.81.0 - /usr/bin/curl
    OpenSSL: 3.0.2 - /usr/bin/openssl
  Virtualization:
    Docker: 27.3.1 - /usr/bin/docker
  IDEs:
    Nano: 6.2 - /usr/bin/nano
    VSCode: 1.95.0 - /snap/bin/code
    Vim: 8.2 - /usr/bin/vim
  Languages:
    Bash: 5.1.16 - /usr/bin/bash
    Perl: 5.34.0 - /usr/bin/perl
    Python3: 3.10.12 - /usr/bin/python3
    Rust: 1.81.0 - ~/.cargo/bin/rustc
  Browsers:
    Chrome: 130.0.6723.69
```

## 5

```
  System:
    OS: Linux 6.11 Fedora Linux 41.20241106.0 (Silverblue)
    CPU: (12) x64 12th Gen Intel(R) Core(TM) i5-12400
    Memory: 19.58 GB / 31.08 GB
    Container: Yes
    Shell: 5.2.32 - /bin/bash
  Binaries:
    Node: 22.11.0 - ~/.local/share/mise/installs/node/22/bin/node
    npm: 10.9.0 - ~/.local/share/mise/installs/node/22/bin/npm
    pnpm: 9.12.0 - ~/.local/share/mise/installs/node/22/bin/pnpm
  Utilities:
    Make: 4.4.1 - /usr/bin/make
    GCC: 14.2.1 - /usr/bin/gcc
    Git: 2.47.0 - /usr/bin/git
    FFmpeg: 7.0.2 - /usr/bin/ffmpeg
    Curl: 8.9.1 - /usr/bin/curl
    OpenSSL: 3.2.2 - /usr/bin/openssl
  Servers:
    Apache: 2.4.62 - /usr/sbin/apachectl
  Virtualization:
    Docker: 27.3.1 - /usr/bin/docker
  IDEs:
    Nano: 8.1 - /usr/bin/nano
    Vim: 9.1 - /usr/bin/vim
  Languages:
    Bash: 5.2.32 - /usr/bin/bash
    Java: 17.0.1 - ~/.local/share/mise/installs/java/openjdk-17.0.1/bin/javac
    Perl: 5.40.0 - /usr/bin/perl
    Python: 3.13.0 - /usr/bin/python
    Python3: 3.13.0 - /usr/bin/python
```

:::note

Fedora Linux は Playwright での Webkit エンジン利用に非対応 https://github.com/microsoft/playwright/issues/14736 です。`pnpm dev` `pnpm build` `pnpm test` などは動作しますが `pnpm --filter @originator-profile/verify e2e` は完走できません。

:::

## 6

```
  System:
    OS: Linux 5.15 Ubuntu 24.04.1 LTS 24.04.1 LTS (Noble Numbat)
    CPU: (16) x64 AMD Ryzen 7 PRO 5750GE with Radeon Graphics
    Memory: 28.28 GB / 31.04 GB
    Container: Yes
    Shell: 5.2.21 - /bin/bash
  Binaries:
    Node: 20.18.1 - /usr/bin/node
    npm: 10.9.0 - /usr/local/bin/npm
    pnpm: 9.12.0 - /usr/local/bin/pnpm
  Managers:
    Apt: 2.9.10 - /usr/bin/apt
  Utilities:
    CMake: 3.28.3 - /usr/bin/cmake
    Make: 4.3 - /usr/bin/make
    GCC: 13.2.0 - /usr/bin/gcc
    Git: 2.43.0 - /usr/bin/git
    Curl: 8.11.0 - /usr/bin/curl
    OpenSSL: 3.3.2 - /usr/bin/openssl
  Virtualization:
    Docker: 27.3.1 - /usr/bin/docker
  IDEs:
    Nano: 7.2 - /usr/bin/nano
    VSCode: 1.95.2 - ~/.vscode-server/bin/e8653663e8840adaf45af01eab5c627a5af81807/bin/remote-cli/code
    Vim: 9.1 - /usr/bin/vim
  Languages:
    Bash: 5.2.21 - /usr/bin/bash
    Perl: 5.38.2 - /usr/bin/perl
    Python3: 3.12.3 - /usr/bin/python3
  Browsers:
    Chrome: 130.0.6723.58
```

## 7

```
  System:
    OS: Linux 6.8 Ubuntu 24.04.1 LTS 24.04.1 LTS (Noble Numbat)
    CPU: (8) x64 Intel(R) Core(TM) i5-8350U CPU @ 1.70GHz
    Memory: 8.85 GB / 23.22 GB
    Container: Yes
    Shell: 5.9 - /usr/bin/zsh
  Binaries:
    Node: 20.13.1 - ~/.local/share/mise/installs/node/20/bin/node
    Yarn: 1.22.19 - /usr/local/bin/yarn
    npm: 10.5.2 - ~/.local/share/mise/installs/node/20/bin/npm
    pnpm: 8.14.1 - ~/node_modules/.bin/pnpm
  Managers:
    Apt: 2.7.14 - /usr/bin/apt
    Cargo: 1.79.0 - ~/.cargo/bin/cargo
    pip3: 24.1.2 - ~/.local/share/mise/installs/python/latest/bin/pip3
    RubyGems: 3.5.9 - ~/.local/share/mise/installs/ruby/3.3.2/bin/gem
  Utilities:
    Make: 4.3 - /usr/bin/make
    GCC: 13.2.0 - /usr/bin/gcc
    Git: 2.43.0 - /usr/bin/git
    Clang: 18.1.3 - /usr/bin/clang
    FFmpeg: 6.1.1 - /usr/bin/ffmpeg
    Curl: 8.5.0 - /usr/bin/curl
    OpenSSL: 3.0.13 - /usr/bin/openssl
  Servers:
    Apache: 2.4.58 - /usr/sbin/apachectl
  Virtualization:
    Docker: 24.0.7 - /usr/bin/docker
    Docker Compose: 1.29.2 - /usr/bin/docker-compose
    VirtualBox: 7.0.16 - /usr/bin/vboxmanage
  IDEs:
    Emacs: 29.3 - /usr/bin/emacs
    Nano: 7.2 - /usr/bin/nano
    Vim: 9.1 - /usr/bin/vim
  Languages:
    Bash: 5.2.21 - /usr/bin/bash
    Perl: 5.38.2 - /usr/bin/perl
    PHP: 7.4.33 - /usr/bin/php
    Python: 3.13.0 - ~/.local/share/mise/installs/python/latest/bin/python
    Python3: 3.13.0 - ~/.local/share/mise/installs/python/latest/bin/python3
    Ruby: 3.3.2 - ~/.local/share/mise/installs/ruby/3.3.2/bin/ruby
    Rust: 1.79.0 - ~/.cargo/bin/rustc
  Databases:
    MySQL: 0.24.04.1 - /usr/bin/mysql
    SQLite: 3.45.1 - /usr/bin/sqlite3
  Browsers:
    Brave Browser: 131.1.73.91
    Chromium: 130.0.6723.58
```

## 8

```
  System:
    OS: macOS 15.1.1
    CPU: (8) arm64 Apple M3
    Memory: 68.44 MB / 24.00 GB
    Shell: 5.9 - /bin/zsh
  Binaries:
    Node: 22.11.0 - ~/.nodebrew/current/bin/node
    Yarn: 1.22.22 - /opt/homebrew/bin/yarn
    npm: 10.9.1 - ~/.nodebrew/current/bin/npm
    pnpm: 9.14.1 - ~/.nodebrew/current/bin/pnpm
  Managers:
    Homebrew: 4.4.8 - /opt/homebrew/bin/brew
    pip3: 24.2 - /opt/homebrew/bin/pip3
    RubyGems: 3.0.3.1 - ~/.rbenv/shims/gem
  Utilities:
    Make: 3.81 - /usr/bin/make
    GCC: 15.0.0 - /usr/bin/gcc
    Git: 2.39.3 - /usr/bin/git
    Clang: 15.0.0 - /usr/bin/clang
    Curl: 8.7.1 - /usr/bin/curl
    OpenSSL: 3.4.0 - /opt/homebrew/bin/openssl
  Servers:
    Apache: 2.4.62 - /usr/sbin/apachectl
  Virtualization:
    Docker: 27.3.1 - /usr/local/bin/docker
    Docker Compose: 2.30.3 - /usr/local/bin/docker-compose
  IDEs:
    VSCode: 1.95.3 - /opt/homebrew/bin/code
    Vim: 9.0 - /usr/bin/vim
    Xcode: /undefined - /usr/bin/xcodebuild
  Languages:
    Bash: 3.2.57 - /bin/bash
    Perl: 5.34.1 - /usr/bin/perl
    Python3: 3.13.0 - /opt/homebrew/bin/python3
    Ruby: 2.6.10 - ~/.rbenv/shims/ruby
  Databases:
    SQLite: 3.43.2 - /usr/bin/sqlite3
  Browsers:
    Chrome: 131.0.6778.86
    Safari: 18.1.1
```
