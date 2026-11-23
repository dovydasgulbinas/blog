{
  description = "dovydas.xyz: Hugo blog with the pico8 theme";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    git-hooks = {
      url = "github:cachix/git-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    git-hooks,
  }: let
    systems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];
    forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});

    # Git hooks: `nix develop` installs them, `nix flake check` (and so CI) runs them on every file.
    gitHooks = pkgs:
      git-hooks.lib.${pkgs.stdenv.hostPlatform.system}.run {
        src = ./.;
        hooks = {
          trim-trailing-whitespace = {
            enable = true;
            excludes = ["\\.md$"]; # two trailing spaces are a Markdown line break
          };
          end-of-file-fixer.enable = true;
          check-merge-conflicts.enable = true;
          check-added-large-files = {
            enable = true;
            args = ["--maxkb=2048"];
          };
          check-yaml.enable = true;
          check-toml.enable = true;
          check-json = {
            enable = true;
            excludes = ["^themes/[^/]+/layouts/"]; # Hugo templates that output JSON, not JSON
          };
          alejandra.enable = true;

          # Template, front matter or config errors fail the commit, not the deploy.
          hugo-build = {
            enable = true;
            name = "hugo build";
            entry = toString (pkgs.writeShellScript "hugo-build-check" ''
              out=$(mktemp -d)
              trap 'rm -rf "$out"' EXIT
              ${pkgs.hugo}/bin/hugo build --quiet --panicOnWarning --noBuildLock --cacheDir "$out/cache" --destination "$out/site"
            '');
            files = "^(content|themes|static|archetypes)/|^hugo\\.toml$";
            pass_filenames = false;
          };

          forbidden-files = {
            enable = true;
            name = "no build output or dependencies";
            language = "fail";
            entry = "Build output and dependencies must not be committed:";
            files = "^(public|resources/_gen|result)(/|$)|(^|/)node_modules/|\\.hugo_build\\.lock$";
          };
        };
      };
  in {
    packages = forAllSystems (pkgs: {
      # The built site: `nix build` → ./result/
      default = pkgs.stdenvNoCC.mkDerivation {
        pname = "dovydas-xyz";
        version = self.shortRev or self.dirtyShortRev or "dev";
        src = pkgs.lib.fileset.toSource {
          root = ./.;
          fileset = pkgs.lib.fileset.unions [
            ./hugo.toml
            ./content
            ./static
            ./themes
          ];
        };
        nativeBuildInputs = [pkgs.hugo];
        buildPhase = ''
          runHook preBuild
          hugo build --minify --gc --panicOnWarning --noBuildLock --cacheDir "$TMPDIR/hugo-cache" --destination "$out"
          runHook postBuild
        '';
        dontInstall = true;
      };
    });

    checks = forAllSystems (pkgs: {
      git-hooks = gitHooks pkgs;

      # Internal links, anchors and assets in the built site (no network in the sandbox).
      links =
        pkgs.runCommand "dovydas-xyz-htmltest" {
          nativeBuildInputs = [pkgs.htmltest];
        } ''
          cp ${./.htmltest.yml} htmltest.yml
          htmltest --conf htmltest.yml --skip-external ${self.packages.${pkgs.stdenv.hostPlatform.system}.default}
          touch $out
        '';
    });

    devShells = forAllSystems (pkgs: let
      hooks = gitHooks pkgs;
    in {
      default = pkgs.mkShell {
        packages =
          [
            pkgs.hugo
            pkgs.htmltest
            pkgs.just
            pkgs.nodejs_22
          ]
          ++ hooks.enabledPackages;
        shellHook = hooks.shellHook;
      };
    });

    formatter = forAllSystems (pkgs: pkgs.alejandra);
  };
}
