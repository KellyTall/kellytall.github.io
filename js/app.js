
//drop down menu

var image1 = 'img/Captainjamescookportrait.jpg';
var name1 = 'James Cook and the voyage of the Endeavor';
var date1 = 'April 1770 made land at Botany Bay';
var sum1 = 'Cook led the first white European expedition to map East Coast of Australia and circumnavigate New Zealand';


var image2 = 'img/Phillip.jpg';
var name2 = 'Arthur Phillip and arrival of the First Fleet';
var date2 = 'First Fleet arrived in January 1788 to form a Penal Colony NSW';
var sum2 = 'Phillip was the first Governor of NSW, and with 750-780 convicts and 550 soldiers and their families, started the colony of NSW in Port Jackson';

var image3 = 'img/macquarie.jpg';
var name3 = 'Lachlan Macquarie and the expansion of the colony';
var date3 = 'Macquarie served from 1810 - 1821';
var sum3 = 'Macquarie was the fifth governor of NSW, and oversaw the shift from penal colony to free settlement.';


$('select').change(function() {
  
  var toChange = $('select').val();

  update(toChange);
});



function update(input) {
  
  if(input === 'cook'){
    $('#tableImage').attr('src', image1);
    $('#tableName').text(name1);
    $('#tableDates').text(date1);
    $('#tableSum').text(sum1);
    
  }else if (input === 'phillip'){
    $('#tableImage').attr('src', image2);
    $('#tableName').text(name2);
    $('#tableDates').text(date2);
    $('#tableSum').text(sum2);
    
  } else  {
    $('#tableImage').attr('src', image3);
    $('#tableName').text(name3);
    $('#tableDates').text(date3);
    $('#tableSum').text(sum3);
  }
  
};