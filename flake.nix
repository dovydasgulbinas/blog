{
  description = "Dovydas.xyz blog runtime";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    oldnix.url = "github:nixos/nixpkgs?ref=nixos-21.11";
  };

  outputs = { nixpkgs, ... } @ inputs: 
    let
      pkgs = nixpkgs.legacyPackages.x86_64-linux;
      oldpkgs = inputs.oldnix.legacyPackages.x86_64-linux;
    in
    {
    packages.x86_64-linux.dovydas-xyz = pkgs.lektor;
    packages.x86_64-linux.default = pkgs.lektor;


    devShells.x86_64-linux.default = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs_23 
          pkgs.lektor 
          pkgs.pre-commit
        ];
        shellHook = ''
          echo "Activating dovydas.xyz Dev Shell!"
        '';
      };
  };
}
