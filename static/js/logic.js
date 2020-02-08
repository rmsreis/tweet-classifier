

$(function() {
  $("#submit").click(function() {
    $.ajax({
      type: 'POST',
      url: '/predict',
      data: {tweet: $('#inputTweet').val(),}
    })
    .done(function(data) {
      $('#message').text(data.output).show();
    });
    event.preventDefault();
  });
});

