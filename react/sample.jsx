var nt = {};

Nested.Listener = {
    componentWillMount : function(){
        var props = this.props,
            update = this.updateOn;

        for( var events in update ){
            this.listenTo( props[ update[ events ] ], events, function(){
                this.forceUpdate();
            });
        }
    },

    componentWillUnmount : function(){
        var props = this.props,
            update = this.updateOn;

        for( var events in update ){
            this.stopListening( props[ update[ events ] ] );
        }
    }
};

Object.assign( Nested.Listener, Backbone.Events );

var Input = React.createClass( {
    render : function(){
        var props = {},
            value = this.props.model.deepGet( this.props.attr );

        if( this.props.type === 'checkbox' ){
            props.checked = value;
            props.onChange = this.onChangeCheckbox;
        }
        else{
            props.value = value;
            props.onChange = this.onChangeInput;
        }

        Object.transform( props, this.props, function( value, name ){
            if( name != 'model' && name != 'attr' ) return value;
        } );

        return React.DOM.input( props );
    },

    onChangeInput : function( e ){
        this.props.model.deepSet( this.props.attr, e.target.value );
    },

    onChangeCheckbox : function( e ){
        this.props.model.deepSet( this.props.attr, e.target.checked );
    }
});

var SampleModel = Nested.Model.extend({
    defaults : {
        name : "",
        password : "",
        settings : Nested.defaults({
            isAdmin : false,
            isActive : true
        })
    }
});

var Sample = React.createClass( {
    mixins : [ Nested.Listener ],
    updateOn : { 'change' : 'model' },

    render : function(){
        var model = this.props.model;

        return (
            <div>
                <label> Name: <Input type='text' model={ model } attr='name'/></label>

                <label> Password: <Input type='text' model={ model } attr='password'/></label>

                <label> Is Admin: <Input type='checkbox' model={ model.settings } attr='isAdmin'/></label>

                <label> Is Active:<Input type='checkbox' model={ model } attr='settings.isActive'/></label>
            </div>
        );
    }
});
