let provider;
let signer;
let contract;

let quantity = 1;

let connectedWallets = 0;

// CONTRACT
const contractAddress =
"PASTE_CONTRACT_ADDRESS";

// ABI
const abi = [
"function claim(address receiver, uint256 quantity) public payable",
"function totalSupply() public view returns (uint256)"
];

// CONNECT
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

  signer =
  provider.getSigner();

  connectedWallets++;

  document.getElementById(
    "walletCount"
  ).innerText =
  connectedWallets;

  document.getElementById(
    "status"
  ).innerText =
  "Wallet Connected";

  loadContract();
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

    document.getElementById(
      "supply"
    ).innerText =
    supply.toString();

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

// MINT
async function mintNFT(){

  if(!signer){

    alert("Connect wallet first");
    return;
  }

  const mintBtn =
  document.getElementById(
    "mintBtn"
  );

  mintBtn.innerText =
  "Minting...";

  mintBtn.disabled = true;

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

// 12 NFTS ONLY
for(let i = 1; i <= 12; i++){

  const img =
  document.createElement("img");

  img.src =
  `${i}.png`;

  gallery.appendChild(img);
}

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
