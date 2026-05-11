let provider;
      quantity
    );

    await tx.wait();

    document.getElementById("status").innerText = "Mint Success 🎉";

    mintBtn.innerText = "Minted";

    loadContract();

  } catch(err) {

    console.log(err);

    document.getElementById("status").innerText = "Mint Failed";

    mintBtn.innerText = "Retry";
  }

  mintBtn.disabled = false;
}

// QUANTITY
function increase() {

  quantity++;

  document.getElementById("qty").innerText = quantity;
}

function decrease() {

  if(quantity > 1) {
    quantity--;
  }

  document.getElementById("qty").innerText = quantity;
}

// GALLERY PREVIEW
const gallery = document.getElementById("gallery");

for(let i = 1; i <= 40; i++) {

  const img = document.createElement("img");

  img.src = `assets/${i}.png`;

  gallery.appendChild(img);
}

// EVENTS

document.getElementById("connectBtn")
.addEventListener("click", connectWallet);


document.getElementById("mintBtn")
.addEventListener("click", mintNFT);
