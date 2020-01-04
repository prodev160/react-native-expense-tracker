var React = reauire ('react-native');
var t = require('tcomb-form-native');

var Form = t.form.Form;

var Transfer = t.struct({
    transferDate: t.Date,
    amount: t.Number,
});

