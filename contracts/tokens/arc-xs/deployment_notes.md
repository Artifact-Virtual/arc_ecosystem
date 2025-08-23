# Deployment Notes

## Deploy ARCxsToken
- Deploy the `ARCxsToken` contract using a UUPS proxy.
- Initialize the contract with:
    - **Admin**: Treasury Safe.

## Deploy StakingVault
- Deploy the `StakingVault` contract using a UUPS proxy.
- Initialize the contract with:
    - **Admin**: Treasury Safe.
    - **arcxAsset**: `ARCxToken` (immutable).
    - **arcxs**: `ARCxsToken` proxy address.
    - **penaltyVault**: `PenaltyVault` (to be deployed next).

### Additional Notes
- The `StakingVault` automatically receives permission to mint and burn `ARCxs`.