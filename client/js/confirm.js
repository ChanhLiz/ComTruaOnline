function showConfirm(message, callback, title = "Xác nhận") {

    document.getElementById("confirmTitle").innerText = title;
    document.getElementById("confirmMessage").innerText = message;

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            document.getElementById("confirmModal")
        );

    const okBtn =
        document.getElementById("confirmOkBtn");

    okBtn.onclick = function () {

        modal.hide();

        if(callback){
            callback();
        }

    };

    modal.show();

}