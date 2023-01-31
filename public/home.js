const getUserData = () => {
    let localUser = localStorage.getItem('user')
    
    if (localUser.length == 0) {
        return window.location.href = "/";
    }

    let user = JSON.parse(localUser);

    let { fname, lname, email, bday, contact } = user;

    let profileName = document.getElementById("profile-name") 
    let firstName = document.getElementById("userfirst") 
    let lastName = document.getElementById("userlast") 
    let birthday = document.getElementById("userbirthdate") 
    let emailAddress = document.getElementById("useremail") 
    let contactNo = document.getElementById("usercontact") 

    var dob = new Date(bday);
    var dobArr = dob.toDateString().split(' ');
    var dobFormat = dobArr[2] + ' ' + dobArr[1] + ' ' + dobArr[3];

    profileName.innerText = fname + " " + lname;
    firstName.innerText = fname;
    lastName.innerText = lname;
    birthday.innerText = dobFormat;
    emailAddress.innerText = email;
    contactNo.innerText = contact;
}

document.getElementById("home-logout").addEventListener("click", () => {
    window.localStorage.clear();
    window.location.href = "/";
})

getUserData();