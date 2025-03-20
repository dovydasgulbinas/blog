{
  description = "Dovydas.xyz blog runtime";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    oldnix.url = "github:nixos/nixpkgs?ref=nixos-21.11";
  };

  outputs = {
    nixpkgs,
    oldnix,
    ...
  } @ inputs: let
    systems = ["x86_64-linux" "aarch64-darwin"]; # Supports Linux & Mac ARM
    forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f system);
  in {
    packages = forAllSystems (system: let
      pkgs = import nixpkgs {inherit system;};
    in {
      dovydas-xyz = pkgs.lektor;
      default = pkgs.lektor;
    });

    devShells = forAllSystems (system: let
      pkgs = import nixpkgs {inherit system;};
      oldpkgs = import oldnix {inherit system;};
    in {
      default = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs_23
          pkgs.lektor
          pkgs.pre-commit
        ];
        shellHook = ''
          # shopt -s hostcomplete
          export LC_ALL="C.UTF-8"
          export LANG="C.UTF-8"

          echo "Activating dovydas.xyz Dev Shell for ${system}!"
        '';
      };
    });
  };
}
