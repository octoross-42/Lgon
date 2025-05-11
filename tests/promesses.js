function attendreAction()
{
    return new Promise((successCallback, failureCallback) =>
{
      // réussir une fois sur deux
      if (Math.random() > .5)
{
        successCallback();
      } else
{
        failureCallback();
      }
    })
}


var p1 = new Promise(function(resolve, reject)
{
    resolve(" !");
    // ou
    // reject("Erreur !");
});
  
p1.then((valeur) =>
{
    console.log(valeur); // Succès !
    }, (raison) =>
{
    console.log(raison); // Erreur !
  });
  