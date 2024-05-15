# 動作確認済み環境

2024年5月14日時点で開発者が動作確認済みの環境の一覧です。[envinfo](https://github.com/tabrindle/envinfo)の出力結果を記載しています。半年に一度内容を更新します。

ここでの動作確認済みとは、[開発ガイド](./index.mdx)の手順を実行し動作（開発用サーバーとWebブラウザーが起動）することを指します。

## 1

```
  System:
    OS: Linux 6.5 Ubuntu 22.04.4 LTS 22.04.4 LTS (Jammy Jellyfish)
    CPU: (12) x64 13th Gen Intel(R) Core(TM) i7-1365U
    Memory: 22.35 GB / 30.99 GB
    Container: Yes
    Shell: 5.1.16 - /bin/bash
  Binaries:
    Node: 22.1.0 - /usr/bin/node
    Yarn: 1.22.19 - ~/.local/bin/yarn
    npm: 10.7.0 - /usr/bin/npm
    pnpm: 9.1.0 - ~/.local/bin/pnpm
  Managers:
    Apt: 2.4.12 - /usr/bin/apt
    Cargo: 1.77.1 - ~/.cargo/bin/cargo
    Homebrew: 4.2.21 - /home/linuxbrew/.linuxbrew/bin/brew
  Utilities:
    Make: 4.3 - /usr/bin/make
    GCC: 11.4.0 - /usr/bin/gcc
    Git: 2.34.1 - /usr/bin/git
    FFmpeg: 4.4.2 - /usr/bin/ffmpeg
    Curl: 7.81.0 - /usr/bin/curl
    OpenSSL: 3.0.2 - /usr/bin/openssl
  Virtualization:
    Docker: 26.1.2 - /usr/bin/docker
  IDEs:
    Nano: 6.2 - /usr/bin/nano
    VSCode: 1.89.1 - /usr/bin/code
  Languages:
    Bash: 5.1.16 - /usr/bin/bash
    Go: 1.22.3 - /home/linuxbrew/.linuxbrew/bin/go
    Java: 18.0.2-ea - /usr/bin/javac
    Perl: 5.34.0 - /usr/bin/perl
    Python: 3.10.12 - /usr/bin/python
    Python3: 3.10.12 - /usr/bin/python3
    Rust: 1.77.1 - ~/.cargo/bin/rustc
  Databases:
    SQLite: 3.37.2 - /usr/bin/sqlite3
  Browsers:
    Chrome: 124.0.6367.201
```

## 2

:::info

Debian 12 で構築した動作検証用環境です。

:::

```
  System:
    OS: Linux 6.1 Debian GNU/Linux 12 (bookworm) 12 (bookworm)
    CPU: (1) x64 Intel(R) Core(TM) i5-8350U CPU @ 1.70GHz
    Memory: 2.64 GB / 3.82 GB
    Container: Yes
    Shell: 5.2.15 - /bin/bash
  Binaries:
    Node: 20.13.1 - ~/.nodenv/versions/20/bin/node
    npm: 10.5.2 - ~/.nodenv/versions/20/bin/npm
    pnpm: 8.15.6 - ~/.nodenv/versions/20/bin/pnpm
  Managers:
    Apt: 2.6.1 - /usr/bin/apt
  Utilities:
    Git: 2.39.2 - /usr/bin/git
    Curl: 7.88.1 - /usr/bin/curl
    OpenSSL: 3.0.11 - /usr/bin/openssl
  Virtualization:
    Docker: 20.10.24+ - /usr/bin/docker
  IDEs:
    Nano: 7.2 - /usr/bin/nano
  Languages:
    Bash: 5.2.15 - /usr/bin/bash
    Perl: 5.36.0 - /usr/bin/perl
    Python3: 3.11.2 - /usr/bin/python3
  Browsers:
    Chrome: 124.0.6367.118
```

## 3

```
  System:
    OS: macOS 14.4.1
    CPU: (8) arm64 Apple M2
    Memory: 97.28 MB / 24.00 GB
    Shell: 7.4.2 - /usr/local/bin/pwsh
  Binaries:
    Node: 18.19.1 - ~/Library/Caches/fnm_multishells/35211_1714209609413/bin/node
    npm: 10.2.4 - ~/Library/Caches/fnm_multishells/35211_1714209609413/bin/npm
    pnpm: 9.1.0 - ~/Library/Caches/fnm_multishells/35211_1714209609413/bin/pnpm
  Managers:
    Homebrew: 4.2.21 - /opt/homebrew/bin/brew
    pip3: 24.0 - /opt/homebrew/bin/pip3
    RubyGems: 3.0.3.1 - /usr/bin/gem
  Utilities:
    Make: 3.81 - /usr/bin/make
    GCC: 15.0.0 - /usr/bin/gcc
    Git: 2.39.3 - /usr/bin/git
    Clang: 15.0.0 - /usr/bin/clang
    Curl: 8.4.0 - /usr/bin/curl
    OpenSSL: 3.3.0 - /opt/homebrew/bin/openssl
  Servers:
    Apache: 2.4.58 - /usr/sbin/apachectl
  Virtualization:
    Docker: 26.1.1 - /usr/local/bin/docker
    Docker Compose: 2.27.0 - /usr/local/bin/docker-compose
  IDEs:
    VSCode: 1.89.1 - /opt/homebrew/bin/code
    Vim: 9.0 - /usr/bin/vim
    Xcode: /undefined - /usr/bin/xcodebuild
  Languages:
    Bash: 3.2.57 - /bin/bash
    Go: 1.22.3 - /opt/homebrew/bin/go
    Perl: 5.34.1 - /usr/bin/perl
    PHP: 8.3.7 - /opt/homebrew/bin/php
    Python3: 3.12.3 - /opt/homebrew/bin/python3
    Ruby: 2.6.10 - /usr/bin/ruby
  Databases:
    SQLite: 3.43.2 - /usr/bin/sqlite3
  Browsers:
    Chrome: 124.0.6367.207
    Edge: 124.0.2478.97
    Safari: 17.4.1
```

## 4

```
  System:
    OS: Linux 6.8 Fedora Linux 40.20240512.0 (Silverblue)
    CPU: (12) x64 12th Gen Intel(R) Core(TM) i5-12400
    Memory: 22.67 GB / 31.08 GB
    Container: Yes
    Shell: 5.2.26 - /bin/bash
  Binaries:
    Node: 20.12.2 - ~/.asdf/installs/nodejs/20.12.2/bin/node
    Yarn: 4.1.0 - ~/.asdf/installs/nodejs/20.12.2/bin/yarn
    npm: 10.5.0 - ~/.asdf/plugins/nodejs/shims/npm
    pnpm: 9.0.6 - ~/.asdf/installs/nodejs/20.12.2/bin/pnpm
  Utilities:
    Make: 4.4.1
    GCC: 14.1.1
    Git: 2.45.0
    Curl: 8.6.0 - /usr/bin/curl
    OpenSSL: 3.2.1 - /usr/bin/openssl
  Servers:
    Apache: 2.4.59
  Virtualization:
    Docker: 24.0.5 - /usr/bin/docker
  IDEs:
    Nano: 7.2
    Vim: 9.1
  Languages:
    Bash: 5.2.26 - /usr/bin/bash
    Java: 17.0.1
    Perl: 5.38.2 - /usr/bin/perl
    Python: 3.12.3
    Python3: 3.12.3
```

:::note

Fedora Linux は Playwright での Webkit エンジン利用に非対応 https://github.com/microsoft/playwright/issues/14736 です。`pnpm dev` `pnpm build` `pnpm test` などは動作しますが `pnpm --filter @originator-profile/verify e2e` は完走できません。

:::

## 5

```
  System:
    OS: macOS 14.4.1
    CPU: (8) arm64 Apple M2
    Memory: 424.17 MB / 24.00 GB
    Shell: 5.9 - /bin/zsh
  Binaries:
    Node: 20.12.0 - ~/.asdf/installs/nodejs/20.12.0/bin/node
    Yarn: 1.22.19 - ~/.yarn/bin/yarn
    npm: 10.5.0 - ~/.asdf/plugins/nodejs/shims/npm
    pnpm: 8.15.6 - ~/.nvm/versions/node/v20.10.0/bin/pnpm
    Watchman: 2024.05.06.00 - /opt/homebrew/bin/watchman
  Managers:
    Cargo: 1.78.0 - /opt/homebrew/bin/cargo
    CocoaPods: 1.11.3 - /usr/local/bin/pod
    Homebrew: 4.2.21 - /opt/homebrew/bin/brew
    pip2: 20.1.1 - /usr/local/bin/pip2
    pip3: 24.0 - ~/.asdf/shims/pip3
    RubyGems: 3.0.3.1 - /usr/bin/gem
  Utilities:
    CMake: 3.29.3 - /opt/homebrew/bin/cmake
    Make: 3.81 - /usr/bin/make
    GCC: 15.0.0 - /usr/bin/gcc
    Git: 2.39.3 - /usr/bin/git
    Clang: 15.0.0 - /usr/bin/clang
    Curl: 8.4.0 - /usr/bin/curl
    OpenSSL: 3.3.0 - /opt/homebrew/bin/openssl
  Servers:
    Apache: 2.4.58 - /usr/sbin/apachectl
  Virtualization:
    Docker: 26.1.1 - /usr/local/bin/docker
    Docker Compose: 2.27.0 - /usr/local/bin/docker-compose
  SDKs:
    iOS SDK:
      Platforms: DriverKit 23.4, iOS 17.4, macOS 14.4, tvOS 17.4, visionOS 1.1, watchOS 10.4
    Android SDK:
      API Levels: 27, 29, 30
      Build Tools: 28.0.3, 29.0.2, 30.0.3
      System Images: android-29 | Intel x86 Atom_64, android-29 | Google APIs Intel x86 Atom, android-30 | Google APIs Intel x86 Atom
  IDEs:
    Android Studio: 4.1 AI-201.8743.12.41.7042882
    VSCode: 1.89.1 - /opt/homebrew/bin/code
    Vim: 9.0 - /usr/bin/vim
    Xcode: 15.3/15E204a - /usr/bin/xcodebuild
  Languages:
    Bash: 3.2.57 - /bin/bash
    Go: 1.22.3 - /opt/homebrew/bin/go
    Java: 1.8.0_292 - /usr/bin/javac
    Perl: 5.34.1 - /usr/bin/perl
    Protoc: 26.1 - /opt/homebrew/bin/protoc
    Python: 3.12.3 - ~/.asdf/shims/python
    Python3: 3.12.3 - ~/.asdf/shims/python3
    Ruby: 2.6.10 - /usr/bin/ruby
    Rust: 1.78.0 - /opt/homebrew/bin/rustc
  Databases:
    PostgreSQL: 14.12 - /opt/homebrew/bin/postgres
    SQLite: 3.43.2 - /usr/bin/sqlite3
  Browsers:
    Brave Browser: 124.1.65.130
    Chrome: 124.0.6367.202
    Safari: 17.4.1
```

## 6

```
  System:
    OS: macOS 14.1
    CPU: (12) arm64 Apple M2 Pro
    Memory: 38.02 MB / 32.00 GB
    Shell: 5.9 - /bin/zsh
  Binaries:
    Node: 20.11.1 - ~/.volta/tools/image/node/20.11.1/bin/node
    Yarn: 1.22.18 - ~/.volta/tools/image/yarn/1.22.18/bin/yarn
    npm: 9.4.2 - ~/.volta/tools/image/npm/9.4.2/bin/npm
    pnpm: 8.15.3 - ~/.volta/tools/image/pnpm/8.15.3/bin/pnpm
  Managers:
    Cargo: 1.51.0 - ~/.cargo/bin/cargo
    Homebrew: 4.2.19 - /usr/local/bin/brew
    pip2: 19.2.3 - ~/.pyenv/shims/pip2
    pip3: 19.2.3 - ~/.pyenv/shims/pip3
    RubyGems: 3.1.2 - ~/.rbenv/shims/gem
  Utilities:
    CMake: 3.28.3 - /usr/local/bin/cmake
    Make: 3.81 - /usr/bin/make
    GCC: 15.0.0 - /usr/bin/gcc
    Git: 2.37.2 - /usr/local/bin/git
    Clang: 15.0.0 - /usr/bin/clang
    Ninja: 1.11.1 - /usr/local/bin/ninja
    Mercurial: 6.6.3 - /usr/local/bin/hg
    FFmpeg: 6.1.1 - /usr/local/bin/ffmpeg
    Curl: 8.1.2 - /usr/bin/curl
    OpenSSL: 3.2.1 - /usr/local/bin/openssl
  Servers:
    Apache: 2.4.56 - /usr/sbin/apachectl
    Nginx: 1.25.4 - /usr/local/bin/nginx
  Virtualization:
    Docker: 25.0.2 - /usr/local/bin/docker
    VirtualBox: 7.0.8 - /usr/local/bin/vboxmanage
  SDKs:
    iOS SDK:
      Platforms: DriverKit 23.5, iOS 17.5, macOS 14.5, tvOS 17.5, visionOS 1.2, watchOS 10.5
    Android SDK:
      API Levels: 23, 27
      Build Tools: 23.0.3, 27.0.3
  IDEs:
    Android Studio: 3.0 AI-171.4443003
    VSCode: 1.87.0 - /usr/local/bin/code
    Vim: 9.0 - /usr/bin/vim
    Xcode: 15.4/15F31d - /usr/bin/xcodebuild
  Languages:
    Bash: 3.2.57 - /bin/bash
    Java: 1.8.0_131 - /Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home/bin/javac
    Perl: 5.30.3 - /usr/bin/perl
    Protoc: 3.21.9 - /usr/local/bin/protoc
    Python: 3.8.1 - ~/.pyenv/shims/python
    Python3: 3.8.1 - ~/.pyenv/shims/python3
    Ruby: 2.7.0 - ~/.rbenv/shims/ruby
    Rust: 1.51.0 - ~/.cargo/bin/rustc
  Databases:
    MySQL: 14.2 - /usr/local/bin/mysql
    SQLite: 3.39.5 - /usr/bin/sqlite3
  Browsers:
    Brave Browser: 123.1.64.116
    Chrome: 124.0.6367.201
    Chrome Canary: 126.0.6475.0
    Edge: 124.0.2478.97
    Safari: 17.1
    Safari Technology Preview: 17.4
```

## 7

:::info

WSL2/Ubuntu 22.04 LTS な動作環境です。

:::

```
  System:
    OS: Linux 5.15 Ubuntu 22.04.4 LTS 22.04.4 LTS (Jammy Jellyfish)
    CPU: (4) x64 Intel(R) N100
    Memory: 5.05 GB / 7.65 GB
    Container: Yes
    Shell: 5.1.16 - /bin/bash
  Binaries:
    Node: 20.10.0 - ~/.nodenv/versions/20.10.0/bin/node
    npm: 10.2.3 - ~/.nodenv/versions/20.10.0/bin/npm
    pnpm: 8.14.1 - ~/.nodenv/versions/20.10.0/bin/pnpm
  Managers:
    Apt: 2.4.11 - /usr/bin/apt
  Utilities:
    Make: 4.3 - /usr/bin/make
    Git: 2.34.1 - /usr/bin/git
    FFmpeg: 4.4.2 - /usr/bin/ffmpeg
    Curl: 7.81.0 - /usr/bin/curl
    OpenSSL: 3.0.2 - /usr/bin/openssl
  Virtualization:
    Docker: 24.0.5 - /usr/bin/docker
  IDEs:
    Emacs: 27.1 - /usr/bin/emacs
    Nano: 6.2 - /usr/bin/nano
    Vim: 8.2 - /usr/bin/vim
  Languages:
    Bash: 5.1.16 - /usr/bin/bash
    Perl: 5.34.0 - /usr/bin/perl
    Python3: 3.10.12 - /usr/bin/python3
  Browsers:
    Chrome: 123.0.6312.58
```
