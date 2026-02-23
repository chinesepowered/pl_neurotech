// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NeuralDataMarketplace is ReentrancyGuard {
    struct ConsentTerms {
        bool allowResearch;
        bool allowCommercial;
        bool allowAITraining;
        uint256 expiresAt;
    }

    struct Dataset {
        uint256 id;
        address owner;
        string cid;
        string metadataUri;
        uint256 price;
        uint256 channelCount;
        uint256 sampleRate;
        uint256 durationSeconds;
        ConsentTerms consent;
        bool active;
        uint256 createdAt;
    }

    struct Purchase {
        uint256 datasetId;
        address buyer;
        uint256 price;
        uint256 purchasedAt;
        string buyerType; // "human" or "agent"
    }

    uint256 private _nextDatasetId;
    mapping(uint256 => Dataset) public datasets;
    mapping(uint256 => Purchase[]) public purchaseHistory;
    mapping(address => uint256) public ownerRevenue;

    event DatasetListed(uint256 indexed id, address indexed owner, string cid, uint256 price);
    event DatasetPurchased(uint256 indexed id, address indexed buyer, uint256 price, string buyerType);
    event DatasetDelisted(uint256 indexed id);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    function listDataset(
        string calldata cid,
        string calldata metadataUri,
        uint256 price,
        uint256 channelCount,
        uint256 sampleRate,
        uint256 durationSeconds,
        bool allowResearch,
        bool allowCommercial,
        bool allowAITraining,
        uint256 consentExpiresAt
    ) external returns (uint256) {
        uint256 id = _nextDatasetId++;

        datasets[id] = Dataset({
            id: id,
            owner: msg.sender,
            cid: cid,
            metadataUri: metadataUri,
            price: price,
            channelCount: channelCount,
            sampleRate: sampleRate,
            durationSeconds: durationSeconds,
            consent: ConsentTerms({
                allowResearch: allowResearch,
                allowCommercial: allowCommercial,
                allowAITraining: allowAITraining,
                expiresAt: consentExpiresAt
            }),
            active: true,
            createdAt: block.timestamp
        });

        emit DatasetListed(id, msg.sender, cid, price);
        return id;
    }

    function purchaseDataset(uint256 datasetId, string calldata buyerType) external payable nonReentrant {
        Dataset storage ds = datasets[datasetId];
        require(ds.active, "Dataset not active");
        require(msg.value >= ds.price, "Insufficient payment");
        require(ds.consent.expiresAt > block.timestamp, "Consent expired");

        ownerRevenue[ds.owner] += msg.value;

        purchaseHistory[datasetId].push(Purchase({
            datasetId: datasetId,
            buyer: msg.sender,
            price: msg.value,
            purchasedAt: block.timestamp,
            buyerType: buyerType
        }));

        emit DatasetPurchased(datasetId, msg.sender, msg.value, buyerType);
    }

    function delistDataset(uint256 datasetId) external {
        Dataset storage ds = datasets[datasetId];
        require(ds.owner == msg.sender, "Not owner");
        require(ds.active, "Already delisted");

        ds.active = false;
        emit DatasetDelisted(datasetId);
    }

    function withdrawFunds() external nonReentrant {
        uint256 amount = ownerRevenue[msg.sender];
        require(amount > 0, "No funds");

        ownerRevenue[msg.sender] = 0;
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Transfer failed");

        emit FundsWithdrawn(msg.sender, amount);
    }

    // View functions
    function getDataset(uint256 id) external view returns (Dataset memory) {
        return datasets[id];
    }

    function getDatasetCount() external view returns (uint256) {
        return _nextDatasetId;
    }

    function getActiveListings() external view returns (Dataset[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < _nextDatasetId; i++) {
            if (datasets[i].active) activeCount++;
        }

        Dataset[] memory active = new Dataset[](activeCount);
        uint256 j = 0;
        for (uint256 i = 0; i < _nextDatasetId; i++) {
            if (datasets[i].active) {
                active[j++] = datasets[i];
            }
        }
        return active;
    }

    function getPurchaseHistory(uint256 datasetId) external view returns (Purchase[] memory) {
        return purchaseHistory[datasetId];
    }

    function getOwnerRevenue(address owner) external view returns (uint256) {
        return ownerRevenue[owner];
    }
}
