
function	parsedRoles(argv)
{
	let i = 0;
	while (i < argv.length)
	{
		argv[i] = argv[i].replace(",", "");
		argv[i] = argv[i].replace("+", "");
		if ((argv[i] === "and") || (argv[i] === "") || (argv[i] == "et"))
			argv.splice(i, 1);
		else
			i ++;
	}
	console.log("final : ", argv);
	return ([])
}

process.argv.splice(0, 2);
console.log(process.argv[0], parseInt(process.argv[0]), process.argv[0], parseFloat(process.argv[0]));
parsedRoles(process.argv);