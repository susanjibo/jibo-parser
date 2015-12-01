
/********************************/
/* test fuctions                */
/********************************/

function check_throw(a) {
    if (!does_it_throw(a))
        throw new Error('Statement did not throw, but its expected to throw');
}

function check_no_throw(a) {
    if (does_it_throw(a))
        throw new Error('statement is not expected to throw, but throwed');
}

function does_it_throw(a) {
    var throwed = false;
    try {
        a();
        throwed = false;
    } catch(e) {
        throwed = true;
    }
    return throwed;
}

function check_parse_ref_json(parses_json, ref_json) {
    ref_obj = JSON.parse(ref_json);
    parses_obj = JSON.parse(parses_json);
    ref_cmp = JSON.stringify(ref_obj);
    parses_cmp = JSON.stringify(parses_obj);
    if (ref_cmp != parses_cmp)
        throw new Error('Expecting reference to be the same as parse, but they were different')
}

/********************************/
/* Initialization               */
/********************************/
var argv = process.argv;

// checking for command line arguments
if (argv.length != 4) {
    console.log('Incorrect number of command line arguments');
    console.log('Usage: node e2e_tests.js full_path_to_dir_containing_jsjibonlu full_path_to_datadir')
    console.log('Example: node e2e_tests.js /Users/my_user/my_directory_containig_jsjibonlu/ /Users/my_user/my_directory/data');
    process.exit(1);
}

// gteting install prefix
var install_prefix = argv[2];
var datadir = argv[3];

// Loading jsjibonlu library
var jsjibonlu = require(install_prefix + '/jsjibonlu');

/********************************/
/* Compiling tests              */
/********************************/

// good rule format 
var grm = 'TopRule = aa;'
var f = function()  {jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");};
check_no_throw(f);

// bad number of argumets
var f = function()  {jsjibonlu.compile_fst_from_text(grm);};
check_throw(f);

// bad number of argumets
var f = function()  {jsjibonlu.compile_fst_from_text("handle:my_handle");};
check_throw(f);

// bad argument types 
var f = function()  {jsjibonlu.compile_fst_from_text("handle:my_handle", grm);};
check_throw(f);

// bad rule format
var f = function()  {jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");};
grm = 'TopRule = aa';
check_throw(f);

// referencing factory rule
grm = 'TopRule = $factory:date;'
check_no_throw(f)

/********************************/
/* Parsing                      */
/********************************/

// bad number of arguments
grm = "TopRule = aa{nl='aa'};";
txt = "aaa"
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");parser = jsjibonlu.build_sentence_parser(fst, fst);};
check_throw(f)

// incorrect argument type
// bad number of arguments
grm = "TopRule = aa{nl='aa'};";
txt = "aaa"
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");parser = jsjibonlu.build_sentence_parser('a');};
check_throw(f)

// correct call
grm = "TopRule = aa{nl='aa'};";
txt = "aaa"
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");parser = jsjibonlu.build_sentence_parser(fst);};
check_no_throw(f)

// incorrect argument type
// bad number of arguments
grm = "TopRule = aa{nl='aa'};";
txt = "aaa";
parses_json = '';
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");parser = jsjibonlu.build_sentence_parser(fst);parses_json = parser.parse_sentence(txt,txt);};
check_throw(f)

// incorrect argument type 
grm = "TopRule = aa{nl='aa'};";
txt = "aaa";
parses_json = '';
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");parser = jsjibonlu.build_sentence_parser(fst);parses_json = parser.parse_sentence(fst);};
check_throw(f)

// correct parse 
grm = "TopRule = aa{nl='aa'};";
txt = "aaa";
parses_json = '';
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");parser = jsjibonlu.build_sentence_parser(fst);parses_json = parser.parse_sentence(txt)};
check_no_throw(f)

// empty parse
grm = "TopRule = aa{nl='aa'};";
txt = "aaa";
parses_json = '';
ref_json = '[]';
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");parser = jsjibonlu.build_sentence_parser(fst); parses_json = parser.parse_sentence(txt)};
check_no_throw(f)
check_parse_ref_json(parses_json, ref_json);

// some parse 
grm = "TopRule = aa{nl='aa'};";
txt = "aa";
parses_json = '';
ref_json = '[{"Input":"aa", "NLParse":{"nl":"aa"}, "heuristic_score":3}]';
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");parser = jsjibonlu.build_sentence_parser(fst); parses_json = parser.parse_sentence(txt)};
check_no_throw(f)
check_parse_ref_json(parses_json, ref_json);

// error with factory, unset data dir 
grm = "TopRule = $factory:date{date=date._date_nl};";
txt = "aa";
parses_json = '';
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");parser = jsjibonlu.build_sentence_parser(fst); parses_json = parser.parse_sentence(txt)};
check_throw(f)

// setting the dat_dir
jsjibonlu.set_data_dir(datadir);

// error with unknown factory, data dir is set 
grm = "TopRule = $factory:datedate{date=datedate._date_nl};";
txt = "aa";
parses_json = '';
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");parser = jsjibonlu.build_sentence_parser(fst); parses_json = parser.parse_sentence(txt)};
check_throw(f)

// error with known factory, unknown nl var
grm = "TopRule = $factory:date{date=date._date_nlnl};";
txt = "july 29th 1995";
parses_json = '';
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");parser = jsjibonlu.build_sentence_parser(fst); parses_json = parser.parse_sentence(txt)};
check_throw(f);

// no error 
grm = "TopRule = $factory:date{date=date._date_nl};";
txt = "july 29th 1995";
parses_json = '';
ref_json = '[{"Input":"july 29th 1995", "NLParse":{"date":"07\\/29\\/1995"}, "heuristic_score":15}]';
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");parser = jsjibonlu.build_sentence_parser(fst); parses_json = parser.parse_sentence(txt)};
check_no_throw(f)
check_parse_ref_json(parses_json, ref_json);

/********************************/
/* saving fst                   */
/********************************/

// wrong number of arguments
grm = "TopRule = $factory:date{date=date._date_nl};";
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");fst.save_fst("my_fst_file.fst", 1)};
check_throw(f)

// wrong type of argument 
grm = "TopRule = $factory:date{date=date._date_nl};";
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");fst.save_fst(1)};
check_throw(f)

// correct call 
grm = "TopRule = $factory:date{date=date._date_nl};";
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");fst.save_fst("my_fst_file.fst")};
check_no_throw(f)

/********************************/
/* opening fst file             */
/********************************/

// incorrect number of arguments
var f = function()  {fst = jsjibonlu.read_fst_from_uri("file:my_fst_file.fst", 1);};
check_throw(f)

// wrong type of arguments 
var f = function()  {fst = jsjibonlu.read_fst_from_uri(1);};
check_throw(f)

// non existing file type of arguments 
var f = function()  {fst = jsjibonlu.read_fst_from_uri("file:my_fst_file2.fst");};
check_throw(f)

// correct call 
var f = function()  {fst = jsjibonlu.read_fst_from_uri("file:my_fst_file.fst");};
check_no_throw(f)

/********************************/
/* parsingfrom fst file         */
/********************************/

// correct call 
txt = "july 29th 1995";
parses_json = '';
ref_json = '[{"Input":"july 29th 1995", "NLParse":{"date":"07\\/29\\/1995"}, "heuristic_score":15}]';
var f = function()  {fst = jsjibonlu.read_fst_from_uri("file:my_fst_file.fst");parser = jsjibonlu.build_sentence_parser(fst);parses_json = parser.parse_sentence(txt);};
check_no_throw(f);
check_parse_ref_json(parses_json, ref_json);


/********************************/
/* parsingfrom fst in memory    */
/********************************/

// trying to parse from a removed handle from memory 
grm = "TopRule = $factory:date{date=date._date_nl};";
txt = "july 29th 1995"
parses_json = '';
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");fst1 = jsjibonlu.read_fst_from_uri("handle:my_handle");parser = jsjibonlu.build_sentence_parser(fst1);parses_json = parser.parse_sentence(txt);};
check_no_throw(f)

/********************************/
/* Removing fst from memory     */
/********************************/

// wrong number of arguments
grm = "TopRule = $factory:date{date=date._date_nl};";
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");jsjibonlu.remove_from_memory("handle:my_handle", 1)};
check_throw(f)

// wrong type of argument 
grm = "TopRule = $factory:date{date=date._date_nl};";
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");jsjibonlu.remove_from_memory(1)};
check_throw(f)

// correct call 
grm = "TopRule = $factory:date{date=date._date_nl};";
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");jsjibonlu.remove_from_memory("handle:my_handle")};
check_no_throw(f)

// trying to parse from a removed handle from memory 
grm = "TopRule = $factory:date{date=date._date_nl};";
txt = "july 29th 1995"
parses_json = '';
var f = function()  {fst = jsjibonlu.compile_fst_from_text(grm, "handle:my_handle");jsjibonlu.remove_from_memory("handle:my_handle");fst2 = jsjibonlu.read_fst_from_uri("handle:my_handle");};
check_throw(f)

/********************************/
/* syntax check                 */
/********************************/

// wrong number of arguments
grm = "TopRule = $factory:date{date=date._date_nl};";
var f = function()  {jsjibonlu.syntax_check(grm, "handle:my_handle");};
check_throw(f)

// wrong type of argument 
grm = "TopRule = $factory:date{date=date._date_nl};";
var f = function()  {jsjibonlu.syntax_check(1);};
check_throw(f)

// correct call 
grm = "TopRule = $factory:date{date=date._date_nl};";
var f = function()  {jsjibonlu.syntax_check(grm);};
check_no_throw(f)

// wrong syntax  
grm = "TopRule = $factory:date{date=date._date_nl}";
var f = function()  {jsjibonlu.syntax_check(grm);};
check_throw(f)

// undefined rule 
grm = "TopRule = $a;"
var f = function()  {jsjibonlu.syntax_check(grm);};
check_throw(f)

console.log('Success')


