let inputbox;
document.addEventListener("DOMContentLoaded", function () {

    inputbox = document.getElementById("data");
    console.log(inputbox);

    $("#data").on("change keyup paste", (e) => printMessage("The input has changed."));

    function printMessage(message) {
        console.log(message);
    }

});