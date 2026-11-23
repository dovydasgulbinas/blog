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
    gitHooks = pkgs: let
      python = pkgs.python3.withPackages (ps: [ps.pyyaml]) + "/bin/python3";
    in
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

          # Build the site (drafts included) and check its internal links and anchors.
          # Template, front matter, config or link errors fail the commit, not the deploy.
          hugo-build = {
            enable = true;
            name = "hugo build + htmltest";
            entry = toString (pkgs.writeShellScript "hugo-build-check" ''
              set -euo pipefail
              out=$(mktemp -d)
              trap 'rm -rf "$out"' EXIT
              ${pkgs.hugo}/bin/hugo build --quiet --buildDrafts --panicOnWarning --noBuildLock --cacheDir "$out/cache" --destination "$out/site"
              ${pkgs.htmltest}/bin/htmltest --conf .htmltest.yml --skip-external "$out/site" >"$out/htmltest.log" || { cat "$out/htmltest.log"; exit 1; }
            '');
            files = "^(content|themes|static|archetypes)/|^hugo\\.toml$|^\\.htmltest\\.yml$";
            pass_filenames = false;
          };

          # Front matter, categories, bundle files, alt text, relative links (scripts/hooks/check-content.py).
          check-content = {
            enable = true;
            name = "content: front matter, bundle files, alt text";
            entry = "${python} ${./scripts/hooks/check-content.py} hugo.toml";
            files = "^content/.*\\.md$";
          };

          # Title 20–60 and description 50–160 characters, one category (scripts/hooks/check-seo.py).
          check-seo = {
            enable = true;
            name = "SEO: title, description, category";
            entry = "${python} ${./scripts/hooks/check-seo.py}";
            files = "^content/blog/[^/]+/index\\.md$";
          };

          # Strip metadata and recompress images losslessly.
          optimize-images = {
            enable = true;
            name = "optimize images";
            entry = toString (pkgs.writeShellScript "optimize-images" ''
              export PATH=${pkgs.lib.makeBinPath [pkgs.jpegoptim pkgs.oxipng]}:$PATH
              exec ${pkgs.bash}/bin/bash ${./scripts/hooks/optimize-images.sh} "$@"
            '');
            files = "\\.(jpe?g|png)$";
          };

          # Palette rule: hex colours only in tokens.css.
          theme-colours = {
            enable = true;
            name = "theme: no hex colours outside tokens.css";
            entry = "${pkgs.bash}/bin/bash ${./scripts/hooks/check-theme-colours.sh}";
            files = "^themes/[^/]+/assets/(css|js)/";
            excludes = ["tokens\\.css$"];
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
