jQuery.fn.letterdropFx = function() {
  var dropDelays = '\n';
  var that = this;
  var arr = this.text().split('');
  var range = { min : 1, max : 9 };

  for ( var i = range.min; i <= range.max; i++ ) {
    dropDelays += '.ld' + i + ' { animation-delay: 1.' + i + 's; }\n';  
  }

  $( 'head' ).append( '<style>' + dropDelays + '</style>' );
  this.text('');
  
  $.each(arr, function(index, value) {
    var dp = Math.floor( Math.random() * ( range.max - range.min + 1 ) + range.min );
    that.append( '<span class="letterdrop ld' + dp + '">' + value + '</span>' );   
  });
}
