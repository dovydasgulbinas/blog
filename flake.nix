{
  description = "dovydas.xyz: Hugo blog with the pico8 theme";

  inputs.nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

  outputs = {
    self,
    nixpkgs,
  }: let
    systems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];
    forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
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

    devShells = forAllSystems (pkgs: {
      default = pkgs.mkShell {
        packages = [
          pkgs.hugo
          pkgs.htmltest
          pkgs.just
          pkgs.nodejs_22
        ];
      };
    });

    formatter = forAllSystems (pkgs: pkgs.alejandra);
  };
}
