//THIS MODULE WILL DO THE FOLLOWING
//grab data for current user's best match
//on second click (meaning, I don't like this one, show me someone new) it will
//reduce current match's rating to a negative number before looking for the new match.
//matches are sorted by matchRating and the highest rating is chosen as the new match

$(document).ready(function(){
  let database = firebase.database();
  let currentMatchUID = null;
  let chatroom = "firebase.auth().currentUser.uid+' and '+currentMatchUID";
  //click event for a new patch partner
  $('#parentElement').on('click', '#listenedForId2', function(event){
    event.preventDefault();
    //switch to hot-or-not selection if first match
    //otherwise clear the old user divs for this user's info

    //Downgrade previous match, cause they sucked
    database.ref('userData/'+firebase.auth().currentUser.uid).once('value').then(function(snap){
      let snapv = snap.val();
      console.log(snapv);
      for(var i = 0; i<snapv.userMatches.length; i++){
        if(snapv.userMatches[i].uid == currentMatchUID){
          snapv.userMatches[i].matchRating -= 100;
        }
      }
      console.log(snapv.userMatches);
      database.ref('userData/'+firebase.auth().currentUser.uid+'/userMatches').set(snapv.userMatches);
    })

    database.ref('userData').once('value').then(function(snapshot){
      let sv = snapshot.val();
      let thisUser = firebase.auth().currentUser.uid;
      // console.log(sv);
      reverseMatchOrder = quicksortBasic(sv[thisUser].userMatches);
      // console.log(reverseMatchOrder);

      currentMatchUID = reverseMatchOrder[reverseMatchOrder.length-1].uid
      let name_toDisplay = sv[currentMatchUID].name;
      let age_toDisplay = sv[currentMatchUID].age;
      let gender_toDisplay = sv[currentMatchUID].gender;
      let species_toDisplay = sv[currentMatchUID].species;
      console.log(name_toDisplay);
      console.log(age_toDisplay);
      console.log(gender_toDisplay);
      console.log(species_toDisplay);
    })
  })
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$('#match').on('click', function(event){
  event.preventDefault();
  matchMe();
})
let matchMe = function(){
  chatroom = firebase.auth().currentUser.uid+' and '+currentMatchUID;
  database.ref('newChat').update({[chatroom]:{
    uid1:firebase.auth().currentUser.uid, uid2:currentMatchUID}})
  startListening();
  //have it remove the button it's attached to so it can't be clicked again
  //we don't want to create multiple instances of the chat
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//chat feature

$('#post').on('click', function(event){
  event.preventDefault();
  let msgUser = firebase.auth().currentUser.uid;
  let msgText = $('#user_Message').val().trim();
  chatroom = firebase.auth().currentUser.uid+' and '+currentMatchUID;
  database.ref('newChat/'+chatroom).push({
    user:msgUser,
    msg:msgText
  })
})

let name_toDisplay = "";
let msgUserUID = "";
let startListening = function(){
  database.ref('newChat/'+chatroom).on('child_added', function(snapshot){
    let sv = snapshot.val();
    msgUserUID = sv.user
    let msg_toDisplay = sv.msg

      database.ref().once('value').then(function(snap){
        let sVal = snap.val();
        console.log(sVal.newChat[chatroom].uid1);
        if(sVal.newChat[chatroom].uid1 == firebase.auth().currentUser.uid || sVal.newChat[chatroom].uid2 == firebase.auth().currentUser.uid){
          console.log(msgUserUID);
          name_toDisplay = sVal.userData[msgUserUID].name;
          $('#msg_Display').append('<div>'+name_toDisplay+': '+msg_toDisplay+'</div>');
        }
      });
  })
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//sorting algorithm
  function quicksortBasic(array) {
    if(array.length < 2) {
      return array;
    }

    var pivot = array[0];
    var lesser = [];
    var greater = [];

    for(var i = 1; i < array.length; i++) {
      if(array[i].matchRating < pivot.matchRating) {
        lesser.push(array[i]);
      } else {
        greater.push(array[i]);
      }
    }

    return quicksortBasic(lesser).concat(pivot, quicksortBasic(greater));
  }
})
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// //pull up a fake ad every two clicks.
//
// let clickCounter = 1;
// let adCounter = 1;
// let adArray = ['#ad1','#ad2', '#ad3', '#ad4'];
// function adEnabler(){
//   if(clickCounter%2 == 0){
//     $(adArray[adCounter]).modal();
//     clickCounter++;
//     adCounter++;
//     if(adCounter-1>adArray.length){
//       adCounter = 0;
//     }
//   } else{
//     clickCounter++;
//   }
// }
// $('#test').on('click', function(event){
//   event.preventDefault();
//   adEnabler();
// })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Skip profile creation if user already exists.
//
// function userCheck(){
//   database.ref().once('value').then(function(snapshot){
//     let sv = snapshot.val();
//     let user= firebase.auth().currentUser.uid
//     for(var i = 0; i<sv.userList.length; i++){
//       if(user == sv.userList[[i]]){
//         skip to match page
//       }
//     }
//   })
// }
