#!/usr/bin/env node

const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');
const program = require('commander');


program.version('0.1.0')
	.parse(process.argv);


const inputFile = program.args[0]

const outputFile = program.args[1]



const file = fs.readFileSync(__dirname + "/" + inputFile).toString();

const $ = cheerio.load(file);

let Persons = [];


function ScrapePerson(row) {
	let firstName = $(`#search-results-data-table-row-${row}-cell-0`).first().text();
	let lastName = $(`#search-results-data-table-row-${row}-cell-1`).first().text();
	let company = $(`#search-results-data-table-row-${row}-cell-2`).first().text();
	let email = $(`#search-results-data-table-row-${row}-cell-3`).first().text();

	let person = {
		firstName,
		lastName,
		company,
		email
	}
	if (firstName == "" && lastName == "" && company == "") {
		return null
	}
	return person;
}


for (let i = 0; i < 300; i++) {
	let person = ScrapePerson(i);
	if (person == null) break;
	Persons.push(person);


}
Persons = Persons.filter(person => !!person.email.trim())

let csv = new ObjectsToCsv(Persons);

csv.toDisk(outputFile);
