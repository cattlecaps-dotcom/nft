// app.js

let provider;
let signer;
let contract;

let quantity = 1;

let connectedWallets = 0;

// PASTE CONTRACT ADDRESS
const contractAddress =
"PASTE_CONTRACT_ADDRESS";

// THIRDWEB ABI
const abi = [
"function claim(address receiver, uint256 quantity) public payable",
"function totalSupply() public view returns (uint256)"
];

// CONNECT WALLET
async function connectWallet(){

  if(!window.ethereum){

    alert("Install MetaMask");
    return;
  }

  provider =
  new ethers.providers.Web3Provider(window.ethereum);

  await provider.send(
    "eth_requestAccounts",
    []
  );

  signer = provider.getSigner();

  connectedWallets++;

  document.getElementById(
    "walletCount"
  ).innerText =
  connectedWallets;

  document.getElementById(
    "status"
  ).innerText =
  "Wallet Connected";

  await checkNetwork();

  await loadContract();
}

// NETWORK
async function checkNetwork(){

  const network =
  await provider.getNetwork();

  if(network.chainId !== 137){

    alert("Switch to Polygon Mainnet");
  }
}

// LOAD CONTRACT
async function loadContract(){

  contract =
  new ethers.Contract(
    contractAddress,
    abi,
    signer
  );

  try{

    const supply =
    await contract.totalSupply();

    animateSupply(
      parseInt(supply)
    );

    document.getElementById(
      "mintedCount"
    ).innerText =
    supply.toString();

    const holders =
    Math.floor(
      Math.random() * 2000
    ) + 500;

    document.getElementById(
      "holderCount"
    ).innerText =
    holders;

  }catch(err){

    console.log(err);
  }
}

// SUPPLY ANIMATION
function animateSupply(target){

  let count = 0;

  const speed =
  target / 50;

  const update = () => {

    count += speed;

    if(count < target){

      document.getElementById(
        "supply"
      ).innerText =
      Math.floor(count);

      requestAnimationFrame(update);

    }else{

      document.getElementById(
        "supply"
      ).innerText =
      target;
    }
  };

  update();
}

// MINT FEED
const feed =
document.getElementById("feed");

function addMintFeed(wallet,amount){

  const item =
  document.createElement("div");

  item.className =
  "feed-item";

  item.innerHTML = `
    <span>${wallet}</span>
    <span>Minted ${amount}</span>
  `;

  feed.prepend(item);
}

// MINT NFT
async function mintNFT(){

  if(!signer){

    alert("Connect wallet first");
    return;
  }

  const mintBtn =
  document.getElementById(
    "mintBtn"
  );

  mintBtn.disabled = true;

  mintBtn.innerText =
  "Minting...";

  document.getElementById(
    "status"
  ).innerText =
  "Processing Transaction";

  try{

    const tx =
    await contract.claim(
      await signer.getAddress(),
      quantity
    );

    await tx.wait();

    document.getElementById(
      "status"
    ).innerText =
    "Mint Success 🎉";

    mintBtn.innerText =
    "Minted";

    loadContract();

    const address =
    await signer.getAddress();

    addMintFeed(
      address.slice(0,6)+"...",
      quantity
    );

  }catch(err){

    console.log(err);

    document.getElementById(
      "status"
    ).innerText =
    "Mint Failed";

    mintBtn.innerText =
    "Retry";
  }

  mintBtn.disabled = false;
}

// QUANTITY
function increase(){

  quantity++;

  document.getElementById(
    "qty"
  ).innerText =
  quantity;
}

function decrease(){

  if(quantity > 1){

    quantity--;
  }

  document.getElementById(
    "qty"
  ).innerText =
  quantity;
}

// MUSIC
const music =
document.getElementById(
  "bgMusic"
);

const musicBtn =
document.getElementById(
  "musicBtn"
);

let playing = false;

musicBtn.onclick = () => {

  if(!playing){

    music.play();

    musicBtn.innerText =
    "🔊";

  }else{

    music.pause();

    musicBtn.innerText =
    "🎵";
  }

  playing = !playing;
};

// GALLERY
const gallery =
document.getElementById(
  "gallery"
);

for(let i = 1; i <= 40; i++){

  const img =
  document.createElement("img");

  img.src =
  `./assets/${i}.png`;

  gallery.appendChild(img);
}

// PARALLAX
const heroImage =
document.querySelector(
  ".hero-image"
);

document.addEventListener(
  "mousemove",
  (e)=>{

    const x =
    (window.innerWidth/2 - e.pageX)/40;

    const y =
    (window.innerHeight/2 - e.pageY)/40;

    heroImage.style.transform =
    `rotateY(${x}deg)
     rotateX(${-y}deg)`;
  }
);

// CURSOR GLOW
const glow =
document.querySelector(
  ".cursor-glow"
);

document.addEventListener(
  "mousemove",
  e => {

    glow.style.left =
    e.clientX + "px";

    glow.style.top =
    e.clientY + "px";
  }
);

// EVENTS
document
.getElementById("connectBtn")
.addEventListener(
  "click",
  connectWallet
);

document
.getElementById("mintBtn")
.addEventListener(
  "click",
  mintNFT
);
