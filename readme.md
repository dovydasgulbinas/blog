enable dev environment:
    
    nix develop

test dovydas.xyz by calling:

    cd tests

emulate specific device:
    cd tests &&
    npx playwright open --device="Galaxy Tab S4" localhost:5000
 
