fetch('api/test.php') // Use async and await instead as it's much easier
    .then(r => r.json())
    .then(d => {
        console.log(d)
    });
