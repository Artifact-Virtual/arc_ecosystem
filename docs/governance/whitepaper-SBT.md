
# ARC Identity SBT

<p align="left">
  <img src="https://img.shields.io/badge/Access%20Control-Enabled-9cf?style=flat-square&logo=solidity" alt="Access Control"/>
  <img src="https://img.shields.io/badge/Pausable-Enabled-9cf?style=flat-square&logo=solidity" alt="Pausable"/>
  <img src="https://img.shields.io/badge/ERC721%2BERC5192-Locked-9cf?style=flat-square&logo=solidity" alt="ERC721+ERC5192"/>
  <img src="https://img.shields.io/badge/PRBMath-UD60x18-9cf?style=flat-square&logo=solidity" alt="PRBMath"/>
  <img src="https://img.shields.io/badge/Status-Stable-brightgreen?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/badge/Chain-Base%20(EVM)-blue?style=flat-square" alt="Chain"/>
  <img src="https://img.shields.io/badge/License-AGPL--3.0-blueviolet?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/Admin-Timelock%2BSafe-orange?style=flat-square" alt="Admin"/>
  <img src="https://img.shields.io/badge/Integrates-ARCx%2C%20EAS%2C%20MACI-9cf?style=flat-square" alt="Integrates"/>
</p>

---

**Version:** 1.0 BETA (hardened)

## 0. Purpose & Scope

Non-transferable, revocable, EAS-gated SBTs proving roles; decay-weighted identity power; deterministic topic eligibility; exhaustive events; strict gas/DoS bounds.


## 1. Roles, Layers, Masks

Roles (bytes32): `ROLE_CODE`, `ROLE_VALIDATOR`, `ROLE_GOV`, `ROLE_RWA_CURATOR`, `ROLE_ORACLE_OP`, `ROLE_AUDITOR` (governance may add).
Layers (bitmask `uint256`): `TOKEN=1<<0`, `SBT=1<<1`, `RWA_ENERGY=1<<2`, `RWA_CARBON=1<<3`, `GRANTS=1<<4`, `PARAMS=1<<5`, `TREASURY=1<<6`.
Role→Topic mask stored on-chain (`roleTopicMask[role]`), validated against `LAYER_MASK_ALL`.


## 2. Attestations (EAS, single-use)

Issuance requires EAS UID under `schemaId_IdentityRole`. Checks: schema match; `recipient==to`; `attester∈issuers`; `!revoked`; `expiresAt≥now+safety`; optional `refUID` allowlist; `data=(role,to,issuer,expiresAt,uri,evidenceHash)`. UID is consumed exactly once; revocation is prospective only.


## 3. Token Model & Standards

ERC-721 compatible + ERC-5192 “Locked”. `tokenId=keccak256(abi.encode(to,role,version))`. Transfers/approvals/permits disabled; `locked(tokenId)=true`; emit `Locked(tokenId)` on mint; `revoke()` burns and disables role.


## 4. Activity, Expiry, Decay

Per `(address,role)` heartbeat `lastBeat` auto-updated by recognized on-chain hooks (vote start/tally, proposal interaction, oracle op, attestation) and manual `heartbeat(role)`.
Decay: `decay(Δ)=max(floorWad, expWad(−Δ/T))`; defaults `T=90d`, `floorWad=0.25e18`. Expired roles contribute `0`.


## 5. Weights & Eligibility

`f_id(addr)=Σ roleWeight[role] * decay(addr,role)` across active, unexpired roles.
`weightOfForTopic(addr,mask)` sums only roles where `(roleTopicMask & mask)!=0`.
Component caps/normalization enforced in `ARCxEligibility`; SBT enforces role-level bounds only.


## 6. Issuers, Limits, Anti-DoS

Issuers are allowlisted, versioned, and rate-limited per epoch (`epochSeconds=86400`, `maxIssuesPerEpoch`).
Per-address role cap `maxRolesPerAddress` (default 16).
Role sets are tracked with an index for O(1) add/remove; enumeration is bounded.


## 7. Storage Layout (stable)

```solidity
address timelock
address safeExecutor
address eas
bytes32 schemaId_IdentityRole
mapping(address=>bool) isIssuer
uint64 epochSeconds
uint32 maxIssuesPerEpoch
mapping(address=>mapping(uint64=>uint32)) issuesInEpoch
struct RoleRec{uint256 weightWad;uint64 expiresAt;uint64 lastBeat;bool active;string uri;bytes32 evidenceHash;uint32 version;}
mapping(address=>mapping(bytes32=>RoleRec)) roles
mapping(bytes32=>uint256) roleTopicMask
mapping(bytes32=>uint256) roleDefaultWeightWad
mapping(address=>bytes32[]) rolesList
mapping(address=>mapping(bytes32=>uint8)) roleIndexPlus1
uint256 decay_T_seconds
uint256 decay_floorWad
mapping(bytes32=>bool) consumedUID
bool paused
```


## 8. Events & Errors

Events: `IssuerAdded(address,uint256)`, `IssuerRemoved(address,uint256)`,
`RoleIssued(address,bytes32,uint256,uint256,string,bytes32)`, `RoleRevoked(address,bytes32,uint256,string)`,
`Heartbeat(address,bytes32,uint256)`, `RoleWeightSet(bytes32,uint256)`, `TopicMaskSet(bytes32,uint256)`,
`ConfigSet(bytes32,uint256)`, `Locked(uint256)`, `Paused(address)`, `Unpaused(address)`.
Errors: `TransferDisabled()`, `NotIssuer()`, `RateLimited()`, `InvalidEAS()`, `AlreadyUsedUID()`, `UnsafeExpiry()`, `Expired()`, `NotOwnerOrIssuer()`, `TooManyRoles()`, `InvalidTopicMask()`, `ZeroAddress()`.


## 9. Exact Semantics (authoritative)

* `issue(to,role,uid)`: require `to!=0`, role∉held or version++ on re-issue; verify EAS; issuer rate-limit; `roles[to][role]={weight,expiresAt,lastBeat=now,active=true,uri,evidenceHash,version}`; push to `rolesList` if new; mint 5192-locked NFT; consume UID; emit `RoleIssued`, `Locked`.
* `revoke(tokenId,reason)`: only issuer/admin or owner; burn; mark inactive; remove from `rolesList` via swap-pop; emit `RoleRevoked`.
* `heartbeat(role)`: only holder; update `lastBeat=now`; emit `Heartbeat`.
* `setRoleWeight(role,w)`, `setTopicMask(role,mask)`, `setConfig(key,val)`, `addIssuer(a)`, `removeIssuer(a)`: admin-only; validate bounds (`w≤1e18`) and `mask⊆LAYER_MASK_ALL`; emit events.
* Views: `hasRole(who,role)` requires `active && expiresAt>=now`; `weightOf(who)` and `weightOfForTopic(who,mask)` sum only `rolesList[who]` to bound gas.
* ERC-721: both `transferFrom` overloads, both `safeTransferFrom` overloads, `approve`, `setApprovalForAll` revert `TransferDisabled()`.


## 10. Math, Units, Bounds

All weights WAD `1e18` (PRBMath). `expWad` for decay.
No unbounded loops (bounded by `maxRolesPerAddress`).
Role weights must be non-zero and ≤ `1e18`. Topic masks must be subset of defined bits.


## 11. Security

Strict EAS schema binding; UID single-use; issuer allowlist + epoch rate-limit; pausability gating mutations; non-reentrancy on state changes; overflow/underflow safe; no `delegatecall`; `supportsInterface` includes ERC-165 + ERC-5192 id; upgrade only via explicit governance (if proxied) with storage gap reserved in impl.


## 12. On-Chain Config JSON (emitted)

```
{
 "sbt":{
  "schema":"IdentityRole_v1",
  "roles":{
   "ROLE_CODE":{"weightWad":"5e17","topics":["TREASURY","PARAMS","GRANTS"]},
   "ROLE_VALIDATOR":{"weightWad":"7e17","topics":["PARAMS"]},
   "ROLE_RWA_CURATOR":{"weightWad":"8e17","topics":["RWA_ENERGY","RWA_CARBON"]},
   "ROLE_GOV":{"weightWad":"6e17","topics":["TREASURY","PARAMS","GRANTS"]}
  },
  "decay":{"T_seconds":7776000,"floorWad":"2.5e17"},
  "issuers":["0x...","0x..."],
  "epochSeconds":86400,"maxIssuesPerEpoch":50,
  "maxRolesPerAddress":16,
  "version":"1.2.0"
 }
}
```

## 13) Interfaces

```solidity
interface IARCxIdentitySBT{
  event IssuerAdded(address issuer,uint256 version);
  event IssuerRemoved(address issuer,uint256 version);
  event RoleIssued(address indexed to,bytes32 indexed role,uint256 tokenId,uint256 expiresAt,string uri,bytes32 evidenceHash);
  event RoleRevoked(address indexed from,bytes32 indexed role,uint256 tokenId,string reason);
  event Heartbeat(address indexed who,bytes32 indexed role,uint256 ts);
  event RoleWeightSet(bytes32 indexed role,uint256 weightWad);
  event TopicMaskSet(bytes32 indexed role,uint256 topicMask);
  event ConfigSet(bytes32 key,uint256 val);
  event Locked(uint256 tokenId);
  function issue(address to,bytes32 role,bytes32 easUID) external;
  function revoke(uint256 tokenId,string calldata reason) external;
  function heartbeat(bytes32 role) external;
  function hasRole(address who,bytes32 role) external view returns(bool);
  function weightOf(address who) external view returns(uint256);
  function weightOfForTopic(address who,uint256 topicMask) external view returns(uint256);
  function roleOf(uint256 tokenId) external view returns(bytes32);
  function rolesOf(address who) external view returns (bytes32[] memory);
  function setRoleWeight(bytes32 role,uint256 weightWad) external;
  function setTopicMask(bytes32 role,uint256 topicMask) external;
  function addIssuer(address issuer) external;
  function removeIssuer(address issuer) external;
  function setConfig(bytes32 key,uint256 val) external;
  function locked(uint256 tokenId) external view returns (bool);
  function maxRolesPerAddress() external view returns (uint256);
}
```

## 14) Reference Solidity Skeleton (no comments)

```solidity
pragma solidity ^0.8.24;
import {AccessControl} from "solady/auth/AccessControl.sol";
import {Pausable} from "openzeppelin/contracts/utils/Pausable.sol";
import {ERC721} from "solady/tokens/ERC721.sol";
import {PRBMathUD60x18} from "prb-math/PRBMathUD60x18.sol";
interface IEAS{function getAttestation(bytes32 uid) external view returns(bytes32,address,address,uint64,uint64,bool,bytes32,bytes memory,uint256);}
contract ARCxIdentitySBT is ERC721,AccessControl,Pausable{
  using PRBMathUD60x18 for uint256;
  bytes32 public constant ROLE_ADMIN=keccak256("ROLE_ADMIN");
  bytes32 public constant ROLE_ISSUER=keccak256("ROLE_ISSUER");
  address public timelock; address public safeExecutor; address public eas;
  bytes32 public schemaId_IdentityRole; uint64 public epochSeconds=86400; uint32 public maxIssuesPerEpoch=50;
  mapping(address=>bool) public isIssuer; mapping(address=>mapping(uint64=>uint32)) public issuesInEpoch;
  struct RoleRec{uint256 weightWad;uint64 expiresAt;uint64 lastBeat;bool active;string uri;bytes32 evidenceHash;uint32 version;}
  mapping(address=>mapping(bytes32=>RoleRec)) public roles;
  mapping(bytes32=>uint256) public roleTopicMask;
  mapping(bytes32=>uint256) public roleDefaultWeightWad;
  mapping(address=>bytes32[]) public rolesList;
  mapping(address=>mapping(bytes32=>uint8)) public roleIndexPlus1;
  uint256 public decay_T_seconds=7776000; uint256 public decay_floorWad=2.5e17;
  mapping(bytes32=>bool) public consumedUID; bool public transfersDisabled=true;
  uint256 public constant LAYER_MASK_ALL=(1<<0)|(1<<1)|(1<<2)|(1<<3)|(1<<4)|(1<<5)|(1<<6);
  error TransferDisabled(); error NotIssuer(); error RateLimited(); error InvalidEAS(); error Expired(); error NotOwnerOrIssuer(); error AlreadyUsedUID(); error UnsafeExpiry(); error TooManyRoles(); error InvalidTopicMask(); error ZeroAddress();
  function name() public pure override returns(string memory){return "ARC Identity SBT";}
  function symbol() public pure override returns(string memory){return "ARC-SBT";}
  function tokenURI(uint256) public view override returns(string memory){revert();}
  function supportsInterface(bytes4 iid) public view override(ERC721,AccessControl) returns(bool){
    return ERC721.supportsInterface(iid)||AccessControl.supportsInterface(iid)||(iid==0xb45a3c0e);
  }
  function _transfer(address,address,uint256) internal pure override {revert TransferDisabled();}
  function approve(address,uint256) public pure override {revert TransferDisabled();}
  function setApprovalForAll(address,bool) public pure override {revert TransferDisabled();}
  function locked(uint256) external pure returns(bool){return true;}
  function issue(address to,bytes32 role,bytes32 uid) external { }
  function revoke(uint256 tokenId,string calldata reason) external { }
  function heartbeat(bytes32 role) external { }
  function hasRole(address who,bytes32 role_) external view returns(bool){RoleRec storage r=roles[who][role_];return r.active&&r.expiresAt>=block.timestamp;}
  function rolesOf(address who) external view returns(bytes32[] memory){return rolesList[who];}
  function weightOf(address who) public view returns(uint256){ }
  function weightOfForTopic(address who,uint256 mask) external view returns(uint256){ }
  function roleOf(uint256 tokenId) external view returns(bytes32){ }
  function setRoleWeight(bytes32 role,uint256 w) external { }
  function setTopicMask(bytes32 role,uint256 mask) external { }
  function addIssuer(address a) external { }
  function removeIssuer(address a) external { }
  function setConfig(bytes32 key,uint256 val) external { }
  function _epochOf(uint256 ts) internal view returns(uint64){return uint64(ts/epochSeconds);}
  function _decay(uint256 last) internal view returns(uint256){uint256 d=block.timestamp>last?block.timestamp-last:0;uint256 m=PRBMathUD60x18.exp((d*1e18)/decay_T_seconds*-1e18);return m<decay_floorWad?decay_floorWad:m;}
}
```

## 15) Tests & Invariants (must-pass)

Property: single-use UID; issuer-only; non-transferability; decay monotonic; expiry→0; role cap; topic mask subset; enumeration bounded.
Fuzz: issuance storms per issuer epoch; churn revoke/re-issue; heartbeat spam; malformed EAS data; near-expiry races.
Invariants: identity component ≤ configured caps (via Eligibility); paused→no mutations; no unbounded loops; issuer rate-limit holds; `locked(tokenId)` always true.
