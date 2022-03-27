const NFT = artifacts.require("NFT");
const Marketplace = artifacts.require("Marketplace");

contract("Contract", (accounts) => {
  let nft;
  let marketplace;
  let URI;
  let account;
  let account2;
  before(async () => {
    URI = "sample uri";
    nft = await NFT.deployed();
    account = accounts[0];
    account2 = accounts[1];
    account3 = accounts[2];
    marketplace = await Marketplace.deployed();
  });

  describe("NFT", () => {
    it("contract deployed ", async () => {
      const address = await nft.address;
      assert.notEqual(address.toString(), "");
    });
    it("Nft name is fakeyQR ", async () => {
      const name = await nft.name();
      assert.equal(name.toString(), "fakeyQR");
    });
    it("Minting nft ", async () => {
      await nft.mint(URI);
      const tokenId = await nft.tokenId();
      const tokenURI = await nft.tokenURI(1);
      assert.equal(tokenId.toString(), "1");
      assert.equal(tokenURI.toString(), URI);
    });
  });
  describe("Marketplace", () => {
    it("contract deployed ", async () => {
      const address = await marketplace.address;
      assert.notEqual(address.toString(), "");
    });

    it("fee percent is 1", async () => {
      const fee = await marketplace.feePercent();
      assert.equal(fee.toString(), "1");
    });
    it("feeAccount is msg sender", async () => {
      const feeAccount = await marketplace.feeAccount();
      assert.equal(feeAccount.toString(), account);
    });
  });

  describe("making marketplace item", () => {
    before(async () => {
      await nft.mint(URI);
      await nft.setApprovalForAll(marketplace.address, true);
    });

    it("should track Created item, transfer nft to Marketplace, emit offered event", async () => {
      const result = await marketplace.makeItem(nft.address, 1, 10);
      const owner = await nft.ownerOf(1);
      console.log(owner);

      const item = await marketplace.items(1);
      // console.log(item.price.toString());

      const price = await marketplace.getTotalPrice(1);
      console.log(price.toString());
    });

    it("Purchasing marketplace item", async () => {
      const result = await marketplace.purchaseItem(1, {
        from: account3,
        value: 11,
      });

      const log = result.logs;
      console.log(log);

      // const owner = await nft.ownerOf(1);
      // console.log(owner);

      // const item = await marketplace.items(1);
      // console.log(item);

      // const price = await marketplace.getTotalPrice(1);
      // console.log(price.toString());
    });
  });
});
