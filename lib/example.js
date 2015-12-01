//////////////////////////
// Library Initialization
//////////////////////////

// checking for command line arguments
var argv = process.argv;

if (argv.length != 4) {
    console.log('Incorrect number of command line arguments');
    console.log('Usage: node example.js full_path_to_dir_containing_jsjibonlu full_path_to_datadir')
    console.log('Example: node example.js /Users/my_user/my_directory_containig_jsjibonlu/ /Users/my_user/my_directory/data');
    process.exit(1);
}

// gteting install prefix
var install_prefix = argv[2];
var datadir = argv[3];

// Loading jsjibonlu library
var jsjibonlu = require(install_prefix + '/jsjibonlu');

// Setting datapath (directory with factory rules
// and word lists
jsjibonlu.set_data_dir(datadir)

//////////////////////////
// Compiling a rule
//////////////////////////

// Rule to be compiled
var grm = "TopRule = $* hello{nl='hello'}|goodbye{nl='goodbye'} $* $factory:date{date=date._date_nl} $* ;";

// Compiling rule (use a handle name)
var fst1 = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");

//////////////////////////
// Parsing 
//////////////////////////

// Creating rule parser
var parser = jsjibonlu.build_sentence_parser(fst1);

// Parsing sentence
var sentence = "aaaa hello and the day is july the 29th of the year 1995 yeah";
var parses_json = parser.parse_sentence(sentence);
var parses_obj = JSON.parse(parses_json);
console.log("*** These are the parses of sentence:" + sentence)
console.log(parses_obj)

//////////////////////////
// Parsing from an fst that is already
// in memory
//////////////////////////
var fst4 = jsjibonlu.read_fst_from_uri("handle:my_handle");
var parser = jsjibonlu.build_sentence_parser(fst4);
var sentence = "aaaa hello and the day is july the 29th of the year 1995 yeah";
var parses_json = parser.parse_sentence(sentence);
var parses_obj = JSON.parse(parses_json);
console.log("*** These are the parses of sentence:" + sentence)
console.log(parses_obj)

//////////////////////////
// Saving compiled fst
//////////////////////////
// Saving compiled rule
fst1.save_fst("myfst.fst");

//////////////////////////
// Openingfst from file
//////////////////////////
var fst2 = jsjibonlu.read_fst_from_uri("file:myfst.fst");

//////////////////////////
// Parsing 
//////////////////////////

// Creating rule parser
var parser = jsjibonlu.build_sentence_parser(fst2);

// Parsing sentence
var sentence = "aaaa hello and the day is july the 29th of the year 1995 yeah";
var parses_json = parser.parse_sentence(sentence);
var parses_obj = JSON.parse(parses_json);
console.log("*** These are the parses of sentence:" + sentence)
console.log(parses_obj)

///////////////////////////
// Removing rom memory
//////////////////////////
// Atempting to remove from memory a uri that does not exist
// will not throw an error
jsjibonlu.remove_from_memory("file:myfst.fst");
jsjibonlu.remove_from_memory("handle:my_handle");
// the statement in the following line will fail, since it has been removed from memory:
// var fst3 = jsjibonlu.read_fst_from_uri("handle:my_handle");

///////////////////////////
// syntax check (without compiling) 
//////////////////////////

// The only difference between compile_fst_from_text and
// syntax_check is that syntax_check does not compile the 
// fst. all the syntax checks are exactly the same.
// compile_fst_from_text throws exactly the same errors
// (in the same json format) when finding syntax errors

// correcty syntax (does not throw)
jsjibonlu.syntax_check(grm);

// incorrect syntax (does throw)
var wrong_rule = "TopRule = a b c $a {ret='a'}; a = a {m='b};"
try {
    jsjibonlu.syntax_check(wrong_rule)
} catch (e) {
    err_obj = JSON.parse(e.message);
    console.log("*** Example of compilation error object:");
    console.log(err_obj);
    console.log("*** example of error member in the error object:");
    console.log(err_obj.info.msg);
}


