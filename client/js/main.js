let selectedProduct = null;
// DETAIL PAGE

function goToDetail(id) {
  window.location.href = `/pages/product-detail.html?id=${id}`;
}


// INIT

// loadProducts();
updateCartCount();



function getCartKey() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? `cart_${user.id}` : "cart_guest";
}

function getCart() {
  return JSON.parse(localStorage.getItem(getCartKey())) || [];
}

function saveCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
}


// ADD TO CART (FIX)
function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function addToCart(product){
console.log(product);

    console.log("Category:", product.category_id);
    const user = getUser();

    if(!user){
        showLoginPopup();
        return;
    }

    selectedProduct = product;
    updateOptionUI(product.category_id);

    document.getElementById("optionProductName").innerText =
        product.name;

    // Reset lựa chọn radio
[
    "riceNormal",
    "noodleNormal",
    "miNormal",
    "iceNormal"
].forEach(id => {

    const el = document.getElementById(id);

    if(el){
        el.checked = true;
    }

});

// Reset độ cay
const spicyLevel = document.getElementById("spicyLevel");
if(spicyLevel){
    spicyLevel.value = "Ít cay";
}



// Reset ghi chú
const foodNote = document.getElementById("foodNote");
if(foodNote){
    foodNote.value = "";
}

// Hiện popup
const optionModalEl = document.getElementById("optionModal");

if(optionModalEl){

    bootstrap.Modal
        .getOrCreateInstance(optionModalEl)
        .show();

}
}

const confirmBtn =
document.getElementById("confirmOptionBtn");

if(confirmBtn){

    confirmBtn.addEventListener("click",function(){

        if(!selectedProduct){
            return;
        }

        const options = {};

        switch(Number(selectedProduct.category_id)){

        case 1: // Cơm

            options.extraRice =
                document.getElementById("riceExtra").checked;

            options.spicyLevel =
                document.getElementById("spicyLevel").value;

            break;

        case 2: // Bún

            options.extraNoodle =
                document.getElementById("noodleExtra").checked;

            options.spicyLevel =
                document.getElementById("spicyLevel").value;

            break;

        case 3: // Mì

            options.extraMi =
                document.getElementById("miExtra").checked;

            options.spicyLevel =
                document.getElementById("spicyLevel").value;

            break;

        case 4: // Nước

            options.extraIce =
                document.getElementById("iceExtra").checked;

            break;
    }

        const note =
    document.getElementById("foodNote").value.trim();

        if(note){
            options.note = note;
        }

        const cart = getCart();

        const existing = cart.find(item=>

            item.id===selectedProduct.id &&

            JSON.stringify(item.options)===JSON.stringify(options)

        );

        if(existing){

            existing.quantity++;

        }else{


        let finalPrice = Number(selectedProduct.new_price);

        if(options.extraRice){
            finalPrice += 5000;
        }

        if(options.extraNoodle){
            finalPrice += 5000;
        }

        if(options.extraMi){
            finalPrice += 5000;
        }

            cart.push({

                id:selectedProduct.id,
                name:selectedProduct.name,
                basePrice: Number(selectedProduct.new_price),
                price: finalPrice,
                thumbnail:selectedProduct.thumbnail,
                quantity:1,
                options

            });
        }

        saveCart(cart);
        updateCartCount();

        bootstrap.Modal
            .getInstance(
                document.getElementById("optionModal")
            )
            .hide();

        bootstrap.Modal
            .getOrCreateInstance(
                document.getElementById("cartModal")
            )
            .show();

        selectedProduct = null;

    });
  }

function updateOptionUI(categoryId){

    const groups = [
        "riceOptionGroup",
        "noodleOptionGroup",
        "noodleTypeGroup",
        "drinkOptionGroup",
        "spicyGroup"
    ];

    groups.forEach(id=>{

        const el=document.getElementById(id);

        if(el){
            el.classList.add("d-none");
        }

    });

    function show(id){

        const el=document.getElementById(id);

        if(el){
            el.classList.remove("d-none");
        }

    }

    switch(Number(categoryId)){

        case 1: // Cơm
            show("riceOptionGroup");
            show("spicyGroup");
            break;

        case 2: // Bún
            show("noodleOptionGroup");
            show("spicyGroup");
            break;

        case 3: // Mì
            show("noodleTypeGroup");
            show("spicyGroup");
            break;

        case 4: // Nước
            show("drinkOptionGroup");
            break;

    }

}

    if(target){

        const el=document.getElementById(target);

        if(el){
            el.classList.remove("d-none");
        }

    }

function show(id){
    const el = document.getElementById(id);
    if(el) el.classList.remove("d-none");
}

updateCartCount();