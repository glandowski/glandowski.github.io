
function CONSTRUCTOR_toolbox()
{
	this.NukeWindow;
	this.Nuke = function (nuke_this)
	{
		this.NukeWindow = window.open('','_Nuke','');

		this.NukeWindow.document.write( '<style>html td,span,div{font-size: 11px !important;color: #000000 !important;font-family: Arial !important;}</style>' + nuke_this);
	}
	this.random_number = function ( min_number, max_number, dice_to_roll)
	{
		var random_result = 0

		if( !isNaN(parseFloat( dice_to_roll )) && isFinite( dice_to_roll ) )
		{
			for( dice_rolled = 0 ; dice_rolled < dice_to_roll ; dice_rolled++ )
			{
				random_result = random_result + Math.floor(Math.random() * (max_number - min_number + 1)) + min_number;
			}
		}
		else
		{
			alert('obj_toolbox.random_number()')
		}
		
		return random_result;
	}
	this.dynamic_sort = function (object_property)
	{
		//Syntax: array_name.sort(obj_toolbox.dynamic_sort("property"));

		var sortOrder = 1;
		if (object_property[0] === "-") {
			sortOrder = -1;
			object_property = object_property.substr(1);
		}
		return function (a, b) {
			var result = (a[object_property] < b[object_property]) ? -1 : (a[object_property] > b[object_property]) ? 1 : 0;
			return result * sortOrder;
		}
	}
	this.formatCurrency = function (nStr)
	{
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return "$" + x1 + x2;
	}
    this.truncate = function ( string , longer_than)
    {
       if (string.length > longer_than)
          return string.substring(0,longer_than)+'...';
       else
          return string;
    }
	this.initialize = function()
	{
		
	}
}
var obj_toolbox = new CONSTRUCTOR_toolbox();


function CONSTRUCTOR_faux_engine()
{
	this.current_contract = "123456";
	this.current_estimate = 0;
	this.current_payslip = 0;
	this.current_items_list = {};
	this.contract_subtabs = 0
	this.nav_main_tab = 0
	this.table_row_css = "rTableCell"
	this.dynamicProjectionDemon = false
    this.back_button = [];

	this.current_dashboard = 'Contracts';

	this.generate_list_of_contracts = function ()
    {
    	var MSG = '';
		
    	MSG += '<div class="rTableRow widgetTable widgetTableHeader">'
        MSG += '    <div class="rTableHead">Contract #</div>'
        MSG += '    <div class="rTableHead">Contractor</div>'
        MSG += '    <div class="rTableHead">Description</div>'
        MSG += '    <div class="rTableHead">Location</div>'
        MSG += '    <div class="rTableHead">Status</div>'
        MSG += '    <div class="rTableHead center-text">% Complete</div>'
        MSG += '    <div class="rTableHead center-text">Current Completion Date</div>'
    	MSG += '</div>'

		this.table_row_css = "rTableCell"

    	for (this_contract in contract_list)
    	{
			var row_css = this.color_table_row();

			if( this_contract == 0)
			{
				row_css = row_css + ' selected_row'
			}

    		MSG += '<div class="rTableRow widgetTable cssTableRow contextMenu_contract" onClick="obj_engine.click_on_contract_list_cell(&apos;' + contract_list[this_contract].id + '&apos;,this, &apos;' + contract_list[this_contract]["description"] + '&apos;);">'
    		MSG += '	<div class="' + row_css + '" style="width:120px;">' + contract_list[this_contract]["id"] + '</div>'
            MSG += '	<div class="' + row_css + '">' + contract_list[this_contract]["contractor"] + '</div>'
            MSG += '	<div class="' + row_css + '">' + contract_list[this_contract]["description"] + '</div>'
    		MSG += '	<div class="' + row_css + '">' + contract_list[this_contract]["location"] + '</div>'
            MSG += '	<div class="' + row_css + '">Active</div>'
    		MSG += '	<div class="' + row_css + ' center-text">' + contract_list[this_contract]["percent_complete"] + '</div>'
            MSG += '	<div class="' + row_css + ' center-text">' + contract_list[this_contract]["completion_date"] + '</div>'
    		MSG += '</div>'
    	}

    	this.stage_list_of_contracts.innerHTML = MSG;

		this.arm_context_menus();

    	return true;
	}
	this.click_on_contract_list_cell = function ( contract_id , this_row , contract_description)
	{
		this.current_contract = contract_id

        $("#contract_detail_number").html(contract_id);
        $("#contract_detail_description").html(contract_description);

		$(this_row).siblings( "div" ).children("div").removeClass("selected_row");
		$(this_row).children("div").addClass("selected_row")
		
		$('#contract_subtabs li:eq(' + this.contract_subtabs + ') a').tab('show');

		switch (this.contract_subtabs ) {
			case 0:
				this.generate_contract_info();
				break;
			case 1:
				this.generate_contract_contacts();
				break;
			case 2:
				this.generate_contract_items_table();
				break;
			case 3:
				this.generate_contract_payslips_table();
				break;
			case 4:
				this.generate_contract_estimates_table();
				break;
			default:
				alert('Add tab index to click_on_contract_list_cell SWITCH')
		}
	}
	this.click_on_contract_list_agreement = function ( target_this_class )
	{
		$( target_this_class ).toggle()
	}
	this.click_on_contract_item_cell = function (contract_id)
	{
		obj_engine.loadModal('item');
	}
	this.click_on_contract_estimate_cell = function (contract_id)
	{
		obj_engine.loadModal('estimate');
	}
	this.click_on_geo = function ( this_geo )
	{
		obj_engine.loadModal('geo', this_geo);
	}
	this.generate_contract_info = function ()
	{
		var info_array = contract_info_list[0]["fields"]

        for( this_contract in contract_info_list )
        {
            if( this.current_contract == contract_info_list[this_contract]["id"] )
            {
                info_array = contract_info_list[this_contract]["fields"]
                break;
            }
        }

    	var MSG = '';

		MSG += '<div class="row">'
		MSG += '	<div class="col-xs-4">'
		MSG += '	</div>'
		MSG += '	<div class="col-xs-8">'
		MSG += '		<div class="btn-group pull-right" role="group" aria-label="...">'
		MSG += '		</div>'
		MSG += '	</div>'
		MSG += '</div>'

		this.contract_subtabs = 0

        $( "#stage_contract_details" ).html( $( "#detail_tab_info" ).html() );

		this.arm_context_menus();

		return true;
	}
    this.generate_contract_contacts = function ()
	{
		var info_array = contract_info_list[0]["fields"]

        for( this_contract in contract_info_list )
        {
            if( this.current_contract == contract_info_list[this_contract]["id"] )
            {
                info_array = contract_info_list[this_contract]["fields"]
                break;
            }
        }

    	var MSG = '';

		MSG += '<div class="row">'
		MSG += '	<div class="col-xs-4">'
		MSG += '	</div>'
		MSG += '	<div class="col-xs-8">'
		MSG += '		<div class="btn-group pull-right" role="group" aria-label="...">'
		MSG += '		</div>'
		MSG += '	</div>'
		MSG += '</div>'

		this.contract_subtabs = 1

        $( "#stage_contract_details" ).html( $( "#detail_tab_contacts" ).html() );

		this.arm_context_menus();

		return true;
	}
	this.generate_random_contract_items = function () 
	{
		for (this_contract = 0 ; this_contract < contract_list.length; this_contract++)
		{
			var number_of_items = obj_toolbox.random_number(3, 50, 1);
			var list_of_items = [];
			var MSG = ''

			for (selected_items = 0 ; selected_items < number_of_items ; selected_items++)
			{
				var this_random_item = bid_items_list[obj_toolbox.random_number(1, bid_items_list.length - 1, 1)];
				eval('list_of_items[' + selected_items + '] = {"id":"' + this_random_item.id + '","description":"' + this_random_item.description + '","unit":"' + this_random_item.unit + '"}')
			}
			list_of_items.sort(obj_toolbox.dynamic_sort("id"));

			contract_list[this_contract]["items"] = list_of_items
		}
		return true;
	}
	this.generate_contract_items_table = function ()
	{
		this.contract_subtabs = 2

		var this_contract
		for (a_contract in contract_list)
		{
			if (this.current_contract == contract_list[a_contract]["id"])
			{
				this_contract = contract_list[a_contract]
			}
		}

		var MSG = '';

		MSG += '<div class="row">'
		MSG += '	<div class="col-xs-2">'
        MSG += '        <select class="form-control widget-form-control">'
		MSG += '            <option>Construction Contract ######</option>'
		MSG += '            <option>Agreement Contract ######</option>'
        MSG += '            <option>Agreement Contract ######</option>'
        MSG += '            <option>All Contracts</option>'
		MSG += '		</select>'
		MSG += '	</div>'
		MSG += '	<div class="col-xs-4">'
		//MSG += '		<span class="badge" onClick="obj_engine.loadModal(&apos;filter&apos;)"> Contract Type = Agreement &nbsp;&nbsp;&nbsp;x</span> '
		MSG += '	</div>'
		MSG += '	<div class="col-xs-6">'
		MSG += '		<div class="btn-group pull-right" role="group" aria-label="...">'
        MSG += '			<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;QCL&apos;)">View QCL</button>'		
		MSG += '			<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;filter&apos;)">Filter Items</button>'		
        MSG += '			<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;item_add&apos;)">Add Item</button>'	
		MSG += '			<a class="btn glyphicon glyphicon-option-vertical" href="#" role="button"></a>'
		MSG += '		</div>'
		MSG += '	</div>'
		MSG += '</div>'

		MSG += '<div class="rTable">'
		MSG += '	<div class="rTableRow widgetTable widgetTableHeader">'
		MSG += '		<div class="rTableHead">Item #</div>'
        MSG += '		<div class="rTableHead">Funding Source</div>'
		MSG += '		<div class="rTableHead">Item Description</div>'
		MSG += '		<div class="rTableHead">Unit</div>'
		MSG += '		<div class="rTableHead">Unit Price</div>'
		MSG += '		<div class="rTableHead">Prelim. Qty</div>'
        MSG += '		<div class="rTableHead">Qty Paid to Date</div>'
		MSG += '		<div class="rTableHead">Current Projected Qty</div>'
        MSG += '		<div class="rTableHead">% Overruns/Underruns</div>'
		MSG += '		<div class="rTableHead">Flags</div>'
        MSG += '		<div class="rTableHead">&nbsp;</div>'

		MSG += '	</div>'
		
		var no_items = true;
        this.random_glyphicon_count = 0
        this.random_glyphicon_runs_count = 0

		if (this_contract["items"])
		{
			if (this_contract["items"].length != 0)
			{
				this.table_row_css = "rTableCell"

				for (an_item in this_contract["items"])
				{
					var for_this_item = this_contract["items"][an_item]

					var row_css = this.color_table_row();

					MSG += '	<div class="rTableRow widgetTable cssTableRow contextMenu_item" ondblclick="obj_engine.click_on_contract_item_cell();">'
					MSG += '		<div class="' + row_css + '" title="' + for_this_item["description"] + '">' + for_this_item["id"] + '</div>'
                    MSG += '		<div class="' + row_css + '">Federal</div>'
					MSG += '		<div class="' + row_css + '" title="' + for_this_item["description"] + '">'
                    
                    MSG +=              obj_toolbox.truncate( for_this_item["description"] , 50 )

                    MSG += '		</div>'
					MSG += '		<div class="' + row_css + ' center-text">' + for_this_item["unit"] + '</div>'
					MSG += '		<div class="' + row_css + ' right-text">$###.###</div>'
                    MSG += '		<div class="' + row_css + ' center-text">' + obj_engine.random_glyphicon('qty') + '</div>'
                    MSG += '		<div class="' + row_css + ' center-text">###</div>'
                    MSG += '		<div class="' + row_css + ' center-text">' + obj_engine.random_glyphicon('qty') + '</div>'
                    MSG += '		<div class="' + row_css + ' center-text" style="padding:3px 0px 3px 1px;">' + obj_engine.random_glyphicon('over_under') + '</div>'
                    MSG += '		<div class="' + row_css + '" style="padding:3px 0px 3px 1px;">' + obj_engine.random_glyphicon() + '</div>'
                    MSG += '		<div class="' + row_css + ' center-text">&nbsp;</div>'
					MSG += '	</div>'

                    var row_css = this.color_table_row();

					MSG += '	<div class="rTableRow widgetTable cssTableRow contextMenu_item" ondblclick="obj_engine.click_on_contract_item_cell();">'
					MSG += '		<div class="' + row_css + '" title="' + for_this_item["description"] + '">' + for_this_item["id"] + '</div>'
                    MSG += '		<div class="' + row_css + '">State</div>'
					MSG += '		<div class="' + row_css + '" title="' + for_this_item["description"] + '">'
                    
                    MSG +=              obj_toolbox.truncate( for_this_item["description"] , 50 )

                    MSG += '		</div>'
					MSG += '		<div class="' + row_css + ' center-text">' + for_this_item["unit"] + '</div>'
					MSG += '		<div class="' + row_css + ' right-text">$###.###</div>'
                    MSG += '		<div class="' + row_css + ' center-text">' + obj_engine.random_glyphicon('qty') + '</div>'
                    MSG += '		<div class="' + row_css + ' center-text">###</div>'
					MSG += '		<div class="' + row_css + ' center-text">' + obj_engine.random_glyphicon('qty') + '</div>'
                    MSG += '		<div class="' + row_css + ' center-text" style="padding:3px 0px 3px 1px;">' + obj_engine.random_glyphicon('over_under') + '</div>'
                    MSG += '		<div class="' + row_css + '" style="padding:3px 0px 3px 1px;">' + obj_engine.random_glyphicon() + '</div>'
                    MSG += '		<div class="' + row_css + ' center-text">&nbsp;</div>'
					MSG += '	</div>'
				}
				no_items = false;
			}
		}

		if (no_items)
		{
			MSG += '	<center>No Items found for this Contract.</center>'
		}

		MSG += '</div>'

		this.stage_contract_details.innerHTML = MSG;

		this.arm_context_menus();

		return true;
	}
	this.generate_random_contract_estimates = function () 
	{
		var list_of_item_estimates = [];

		for( this_contract in contract_list)
		{
			var number_of_estimates = obj_toolbox.random_number(1, 20, 1)

			for( this_item in contract_list[this_contract]["items"])
			{
				var selected_item = contract_list[this_contract]["items"][this_item]
				var MSG = ''
				
				MSG += '['
				for(i = 0 ; i < number_of_estimates ; i++)
				{
					
					
					if( i != 0 )
					{
						MSG += ','
					}

					if( obj_toolbox.random_number(1, 100, 1) < 75 )
					{
						MSG += obj_toolbox.random_number(1, 4, 2)
					}
					else
					{
						MSG += '"&nbsp;"'
					}
				}
				MSG += ']'

				eval( 'contract_list[this_contract]["estimates"][' + this_item + '] = ' + MSG );	
			}
		}

		return true;
	}
	this.generate_contract_estimates_table = function ()
	{
		this.contract_subtabs = 4

		var this_contract
		for (a_contract in contract_list)
		{
			if (this.current_contract == contract_list[a_contract]["id"])
			{
				this_contract = contract_list[a_contract]
			}
		}

		var MSG = '';

		MSG += '<div class="row">'
		MSG += '	<div class="col-xs-2">'
        MSG += '        <select class="form-control widget-form-control">'
		MSG += '            <option>Construction Contract ######</option>'
		MSG += '            <option>Agreement Contract ######</option>'
        MSG += '            <option>Agreement Contract ######</option>'
		MSG += '		</select>'
		MSG += '	</div>'
		MSG += '	<div class="col-xs-4">'
		MSG += '	</div>'
        MSG += '	<div class="col-xs-6">'
		MSG += '		<div class="btn-group pull-right" role="group" aria-label="...">'
		MSG += '			<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;default&apos;)">Filter Estimates</button>'
		MSG += '			<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;default&apos;)">Add Estimate</button>'
		MSG += '			<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;default&apos;)">Move Estimate</button>'
		MSG += '			<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;default&apos;)">Edit Estimate</button>'
		MSG += '			<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;default&apos;)">Remove Estimate</button>'
		MSG += '			<a class="btn glyphicon glyphicon-option-vertical" href="#" role="button"></a>'
		MSG += '		</div>'
		MSG += '	</div>'
		MSG += '</div>'
		
		MSG += '<div class="rTable" id="stage_estimates">'
		MSG += '	<div class="rTableRow widgetTable">'
        MSG += '		<div class="rTableHead center-text">Estimate #</div>'
        MSG += '		<div class="rTableHead center-text">Status</div>'
        MSG += '		<div class="rTableHead center-text">Status Date</div>'
        MSG += '		<div class="rTableHead center-text">Type</div>'
        MSG += '		<div class="rTableHead center-text"># of Payslips</div>'
        MSG += '		<div class="rTableHead center-text">Period End Date</div>'
        MSG += '		<div class="rTableHead center-text">Value</div>'
		MSG += '		<div class="rTableHead">&nbsp;</div>'
		MSG += '	</div>'

		if (this_contract["estimates"].length != 0)
		{
			this.table_row_css = "rTableCell"

			for( i in this_contract["estimates"])
			{

				var row_css = this.color_table_row();

				MSG += '	<div class="rTableRow widgetTable cssTableRow contextMenu_estimate">'
				MSG += '		<div class="' + row_css + ' center-text" ondblclick="obj_engine.loadModal(&apos;estimate&apos;)">' + this.current_contract + '-' + i + '</div>'
				MSG += '		<div class="' + row_css + ' center-text" ondblclick="obj_engine.loadModal(&apos;estimate&apos;)">[status]</div>'
				MSG += '		<div class="' + row_css + ' center-text" ondblclick="obj_engine.loadModal(&apos;estimate&apos;)">MM/DD/YYYY</div>'
				MSG += '		<div class="' + row_css + ' center-text" ondblclick="obj_engine.loadModal(&apos;estimate&apos;)">[type]</div>'
				MSG += '		<div class="' + row_css + ' center-text" ondblclick="obj_engine.loadModal(&apos;estimate&apos;)">###</div>'
				MSG += '		<div class="' + row_css + ' center-text" ondblclick="obj_engine.loadModal(&apos;estimate&apos;)">MM/DD/YYYY</div>'
                MSG += '		<div class="' + row_css + ' right-text" ondblclick="obj_engine.loadModal(&apos;estimate&apos;)">$####.###</div>'
				MSG += '		<div class="' + row_css + '" ondblclick="obj_engine.loadModal(&apos;estimate&apos;)">&nbsp;</div>'
				MSG += '	</div>'
			}
		}
		MSG += '</div>'

		this.stage_contract_details.innerHTML = MSG;

		this.arm_context_menus();
		
		return true;
	}
	this.generate_contract_payslips_table = function ( )
	{
		this.contract_subtabs = 3
		var this_contract
		for (a_contract in contract_list)
		{
			if (this.current_contract == contract_list[a_contract]["id"])
			{
				this_contract = contract_list[a_contract]
			}
		}

		var MSG = '';

		MSG += '<div class="row">'
		MSG += '	<div class="col-xs-2">'
        MSG += '        <select class="form-control widget-form-control">'
		MSG += '            <option>Construction Contract ######</option>'
		MSG += '            <option>Agreement Contract ######</option>'
        MSG += '            <option>Agreement Contract ######</option>'
		MSG += '		</select>'
/*      MSG += '		<select id="contract_estimate_selector" class="form-control widget-form-control" onChange="obj_engine.show_items_for_this_estimate(&apos;contract_estimate_selector&apos;);">'
		if (this_contract["estimates"])
		{
			if (this_contract["estimates"].length != 0)
			{
				for( i in this_contract["estimates"])
				{
					if( i == 0 )
					{
						MSG += '<option value="All">All Payslips</option>'
						MSG += '<option value="0">Unassigned Payslips</option>'
					}
					else
					{
						MSG += '<option value="' + i  + '">Payslips in Estimate #' + i + '</option>';
					}
				}
			}
		}
		MSG += '		</select>'
*/
		MSG += '	</div>'
		MSG += '	<div class="col-xs-4">'
        //MSG += '		<span class="badge" onClick="obj_engine.loadModal(&apos;default&apos;)"> FILTER APPLIED &nbsp;&nbsp;&nbsp;x</span> '
		MSG += '	</div>'
		MSG += '	<div class="col-xs-6">'
		MSG += '		<div class="btn-group pull-right" role="group" aria-label="...">'
		MSG += '			<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;default&apos;)">Filter Payslips</button>'
		MSG += '			<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;payment&apos;)">Add Payslip</button>'
		MSG += '			<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;default&apos;)">Move Payslip</button>'
		MSG += '			<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;payment&apos;)">Edit Payslip</button>'
		MSG += '			<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;default&apos;)">Remove Payslip</button>'
		MSG += '			<a class="btn glyphicon glyphicon-option-vertical" href="#" role="button"></a>'
		MSG += '		</div>'
		MSG += '	</div>'
		MSG += '</div>'
		
		MSG += '<div class="rTable" id="stage_estimate_items">'
		MSG += '	<div class="rTableRow widgetTable cssTableRow">'
		MSG += '		<div class="rTableHead">There are not Payslips for this Contract.</div>'
		MSG += '	</div>'
		MSG += '</div>'

		this.stage_contract_details.innerHTML = MSG;
		this.show_items_for_this_estimate( "contract_estimate_initial_load" );

		this.arm_context_menus();

		return true;
	}
	this.show_items_for_this_estimate = function ( this_dropdown )
	{
		var no_items = true;
		var MSG = ''
		var this_contract
		var this_estimate
		
		if( this_dropdown == "contract_estimate_initial_load" )
		{
			this_estimate = 0
		}
		else
		{
			this_estimate = $( "#" + this_dropdown ).val();
		}
		
		for (a_contract in contract_list)
		{
			if (this.current_contract == contract_list[a_contract]["id"])
			{
				this_contract = contract_list[a_contract]
			}
		}

		MSG += '	<div class="rTableRow widgetTable">'
		MSG += '		<div class="rTableHead center-text" style="width:120px;">Payslip ID</div>'
		MSG += '		<div class="rTableHead center-text" style="width:100px;">Status</div>'
		MSG += '		<div class="rTableHead center-text" style="width:100px;">Item #</div>'
		MSG += '		<div class="rTableHead right-text" style="width:120px;">Qty Applied</div>'
        MSG += '		<div class="rTableHead right-text" style="width:120px;">Funding Source</div>'
		MSG += '		<div class="rTableHead right-text" style="width:120px;">Amount</div>'
		MSG += '		<div class="rTableHead">&nbsp;</div>'
		MSG += '	</div>'
		
		var payslip_id = 1
		this.table_row_css = "rTableCell"

		for (an_item in this_contract["estimates"][this_estimate])
		{

			if( this_contract["estimates"][this_estimate][an_item] != '&nbsp;' )
			{
				var row_css = this.color_table_row();

				MSG += '	<div class="rTableRow widgetTable cssTableRow contextMenu_payslip">'
				MSG += '		<div class="' + row_css + ' center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">' + this.current_contract + '-' + this_estimate + '-' + payslip_id + '</div>'
				MSG += '		<div class="' + row_css + ' center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">[status]</div>'
				MSG += '		<div class="' + row_css + ' right-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);" title="' + this_contract["items"][an_item]["description"] + '">' + this_contract["items"][an_item]["id"] + '</div>'
				MSG += '		<div class="' + row_css + ' center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">' + this_contract["estimates"][this_estimate][an_item] + '</div>'
				MSG += '		<div class="' + row_css + '" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">[source]</div>'
				MSG += '		<div class="' + row_css + ' right-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);" title="This value is a Total Value of the Item Quantity multiplied by the Item Unit Price.">$' + obj_toolbox.random_number(1, 120, 1) + '.' + obj_toolbox.random_number(10, 99, 1) + '</div>'
				MSG += '		<div class="' + row_css + '" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">&nbsp;</div>'
				MSG += '	</div>'

				payslip_id++
			}
			no_items = false;
		}

		if (no_items)
		{
			MSG = ''
			MSG += '<div class="rTableRow widgetTable cssTableRow">'
			MSG += '	<div class="rTableHead">No Pay Slips found for this Estimate</div>'
			MSG += '</div>'
		}

		MSG += '</div>'

        //obj_toolbox.Nuke(MSG);

		$( "#stage_estimate_items" ).html( MSG );

		this.arm_context_menus();

		return true
	}
	this.update_projections_data_object = function ( this_input )
	{
		if ( this_input.id.indexOf('F') != -1 ) 
		{
			projections["federal"][this_input.id] = parseFloat(this_input.value);
		}
		else if ( this_input.id.indexOf('S') != -1 ) 
		{
			projections["state"][this_input.id] = parseFloat(this_input.value);
		}
		else if ( this_input.id.indexOf('M') != -1 ) 
		{
			projections["municipal"][this_input.id] = parseFloat(this_input.value);
		}
		else
		{
			alert('obj_engine.update_projections_data_object needs new conditional');
		}
		this.calculate_projections();
	}
	this.calculate_projections  = function (  )
	{
		/* ADD LEFT THE VALUES */
		projections["monthly"]["field_201601"] = projections["federal"]["field_201601F"] + projections["state"]["field_201601S"] + projections["municipal"]["field_201601M"];
		projections["monthly"]["field_201602"] = projections["federal"]["field_201602F"] + projections["state"]["field_201602S"] + projections["municipal"]["field_201602M"];
		projections["monthly"]["field_201603"] = projections["federal"]["field_201603F"] + projections["state"]["field_201603S"] + projections["municipal"]["field_201603M"];
		projections["monthly"]["field_201604"] = projections["federal"]["field_201604F"] + projections["state"]["field_201604S"] + projections["municipal"]["field_201604M"];
		projections["monthly"]["field_201605"] = projections["federal"]["field_201605F"] + projections["state"]["field_201605S"] + projections["municipal"]["field_201605M"];
		projections["monthly"]["field_201606"] = projections["federal"]["field_201606F"] + projections["state"]["field_201606S"] + projections["municipal"]["field_201606M"];
		projections["monthly"]["field_201607"] = projections["federal"]["field_201607F"] + projections["state"]["field_201607S"] + projections["municipal"]["field_201607M"];
		projections["monthly"]["field_201608"] = projections["federal"]["field_201608F"] + projections["state"]["field_201608S"] + projections["municipal"]["field_201608M"];
		projections["monthly"]["field_201609"] = projections["federal"]["field_201609F"] + projections["state"]["field_201609S"] + projections["municipal"]["field_201609M"];
		projections["monthly"]["field_201610"] = projections["federal"]["field_201610F"] + projections["state"]["field_201610S"] + projections["municipal"]["field_201610M"];
		projections["monthly"]["field_201611"] = projections["federal"]["field_201611F"] + projections["state"]["field_201611S"] + projections["municipal"]["field_201611M"];
		projections["monthly"]["field_201612"] = projections["federal"]["field_201612F"] + projections["state"]["field_201612S"] + projections["municipal"]["field_201612M"];

		$( "#field_201601" ).html( obj_toolbox.formatCurrency( projections["monthly"]["field_201601"] ) );
		$( "#field_201602" ).html( obj_toolbox.formatCurrency( projections["monthly"]["field_201602"] ) );
		$( "#field_201603" ).html( obj_toolbox.formatCurrency( projections["monthly"]["field_201603"] ) );
		$( "#field_201604" ).html( obj_toolbox.formatCurrency( projections["monthly"]["field_201604"] ) );
		$( "#field_201605" ).html( obj_toolbox.formatCurrency( projections["monthly"]["field_201605"] ) );
		$( "#field_201606" ).html( obj_toolbox.formatCurrency( projections["monthly"]["field_201606"] ) );
		$( "#field_201607" ).html( obj_toolbox.formatCurrency( projections["monthly"]["field_201607"] ) );
		$( "#field_201608" ).html( obj_toolbox.formatCurrency( projections["monthly"]["field_201608"] ) );
		$( "#field_201609" ).html( obj_toolbox.formatCurrency( projections["monthly"]["field_201609"] ) );
		$( "#field_201610" ).html( obj_toolbox.formatCurrency( projections["monthly"]["field_201610"] ) );
		$( "#field_201611" ).html( obj_toolbox.formatCurrency( projections["monthly"]["field_201611"] ) );
		$( "#field_201612" ).html( obj_toolbox.formatCurrency( projections["monthly"]["field_201612"] ) );

		/* ADD UP THE VALUES */
		projections["field_2016E"] = 0;
		
		projections["field_2016EM"] = 0;
		for(i in projections["municipal"])
		{
			projections["field_2016EM"] = projections["field_2016EM"] + projections["municipal"][i]
			$( "#" + i ).val( projections["municipal"][i] );
		}
		$( "#field_2016EM" ).html( obj_toolbox.formatCurrency( projections["field_2016EM"] ) );

		projections["field_2016ES"] = 0;
		for(i in projections["state"])
		{
			projections["field_2016ES"] = projections["field_2016ES"] + projections["state"][i]
			$( "#" + i ).val( projections["state"][i] );
		}
		$( "#field_2016ES" ).html( obj_toolbox.formatCurrency( projections["field_2016ES"] ) );
		
		projections["field_2016EF"] = 0;
		for(i in projections["federal"])
		{
			projections["field_2016EF"] = projections["field_2016EF"] + projections["federal"][i]
			$( "#" + i ).val( projections["federal"][i] );
		}
		$( "#field_2016EF" ).html( obj_toolbox.formatCurrency( projections["field_2016EF"] ) );

		projections["field_2016EM"] = 0;
		for(i in projections["monthly"])
		{
			projections["field_2016E"] = projections["field_2016E"] + projections["monthly"][i]
		}
		$( "#field_2016E" ).html( obj_toolbox.formatCurrency( projections["field_2016E"] ) );


		Highcharts.setOptions({
			colors: [ '#66cc99', '#009933', '#003300', '#058DC7', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
		});

		$('#chart_yearlyProjections').highcharts({
			chart: {
				type: 'bar'
			},
			title: {
				text: ''
			},
			xAxis: {
				categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL','AUG','SEP','OCT','NOV','DEC']
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Projected Budget'
				}
			},
			legend: {
				reversed: true
			},
			plotOptions: {
				series: {
					stacking: 'normal',
					pointWidth: 27 //width of the column bars irrespective of the chart size
				}
			},
			series: [{
				name: 'Municipal',
				data: [
					projections["municipal"]["field_201601M"], 
					projections["municipal"]["field_201602M"], 
					projections["municipal"]["field_201603M"], 
					projections["municipal"]["field_201604M"], 
					projections["municipal"]["field_201605M"], 
					projections["municipal"]["field_201606M"], 
					projections["municipal"]["field_201607M"], 
					projections["municipal"]["field_201608M"], 
					projections["municipal"]["field_201609M"], 
					projections["municipal"]["field_201610M"], 
					projections["municipal"]["field_201611M"], 
					projections["municipal"]["field_201612M"]
				]
			}, {
				name: 'State',
				data: [
					projections["state"]["field_201601S"], 
					projections["state"]["field_201602S"], 
					projections["state"]["field_201603S"], 
					projections["state"]["field_201604S"], 
					projections["state"]["field_201605S"], 
					projections["state"]["field_201606S"], 
					projections["state"]["field_201607S"], 
					projections["state"]["field_201608S"], 
					projections["state"]["field_201609S"], 
					projections["state"]["field_201610S"], 
					projections["state"]["field_201611S"], 
					projections["state"]["field_201612S"]
				]
			}, {
				name: 'Federal',
				data: [
					projections["federal"]["field_201601F"], 
					projections["federal"]["field_201602F"], 
					projections["federal"]["field_201603F"], 
					projections["federal"]["field_201604F"], 
					projections["federal"]["field_201605F"], 
					projections["federal"]["field_201606F"], 
					projections["federal"]["field_201607F"], 
					projections["federal"]["field_201608F"], 
					projections["federal"]["field_201609F"], 
					projections["federal"]["field_201610F"], 
					projections["federal"]["field_201611F"], 
					projections["federal"]["field_201612F"]
				]
			}]
		});

		return true;
	}
	this.load_dashboard = function ( this_dashboard, tab_object )
	{
		switch (this.current_dashboard ) 
		{
			case 'Contracts':
				obj_engine.hidden_dashboard_contracts.innerHTML = obj_engine.stage_main.innerHTML;
				break;
			case 'Projections':
				obj_engine.hidden_dashboard_projections.innerHTML = obj_engine.stage_main.innerHTML;
				break;
			case 'Watching':
				obj_engine.hidden_dashboard_watching.innerHTML = obj_engine.stage_main.innerHTML;
				break;
			case 'Add':
				obj_engine.hidden_dashboard_add.innerHTML = obj_engine.stage_main.innerHTML;
				break;
			default:

		}

		switch (this_dashboard)
		{
			case 'Contracts':
				obj_engine.stage_main.innerHTML = obj_engine.hidden_dashboard_contracts.innerHTML;
				obj_engine.hidden_dashboard_contracts.innerHTML = '';
				this.nav_main_tab = 0
				break;
			case 'Projections':
				obj_engine.stage_main.innerHTML = obj_engine.hidden_dashboard_projections.innerHTML;
				obj_engine.hidden_dashboard_projections.innerHTML = '';
				this.nav_main_tab = 1
				obj_engine.calculate_projections();

				break;
			case 'Watching':
				this.nav_main_tab = 2
				obj_engine.stage_main.innerHTML = obj_engine.hidden_dashboard_watching.innerHTML;
				obj_engine.hidden_dashboard_watching.innerHTML = '';
				break;
			case 'Add':
				this.nav_main_tab = 3
				obj_engine.stage_main.innerHTML = obj_engine.hidden_dashboard_add.innerHTML;
				obj_engine.hidden_dashboard_add.innerHTML = '';
				break;
			default:
			 
		}
		$('#nav_main div:eq(' + this.nav_main_tab + ') button').tab('show');
		this.current_dashboard = this_dashboard
	}
    this.go_back = function ()
    {
        obj_engine.loadModal( obj_engine.back_button[ obj_engine.back_button.length-2 ] );
    }
	this.loadModal = function (this_config, var_1)
	{
		//$( "#lightbox" ).html( $("#lightbox_default").html() );
        
        this.back_button[ this.back_button.length ] = this_config;

		switch (this_config)
		{
			case 'default':
				this.stage_modal_title.innerHTML = "[Context Title]"
				this.stage_modal_body.innerHTML = "[Context Content]"
								
				var MSG = ''
                this.stage_modal_buttons.innerHTML = MSG

                var MSG = ''
                this.stage_modal_dynamic.innerHTML = MSG

				$(".modal-dialog").css( "width", "50%" );
                $("#lightbox").modal("show");
			break;
			case 'filter':
				this.stage_modal_title.innerHTML = "Filter By"
				this.stage_modal_body.innerHTML = $("#hidden_model_filter").html();
				
				var MSG = ''
                MSG += '<button type="button" class="btn btn-default">Add Criteria</button>'
                MSG += '<button type="button" class="btn btn-default" data-dismiss="modal">Apply</button>'
				this.stage_modal_buttons.innerHTML = MSG

                var MSG = ''
                this.stage_modal_dynamic.innerHTML = MSG

				$(".modal-dialog").css( "width", "50%" );
                $("#lightbox").modal("show");
			break;
            case 'item':
                
				this.stage_modal_title.innerHTML = "Item Detail"
				this.stage_modal_body.innerHTML = $("#hidden_model_item").html();
				
				var MSG = ''
                MSG += '<button type="button" class="btn btn-default">Edit</button>'
                MSG += '<button type="button" class="btn btn-default" data-dismiss="modal">Save</button>'
                MSG += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
                //MSG += '<button type="button" class="btn btn-default" data-dismiss="modal">Add Overrun</button>'
                //MSG += '<button type="button" class="btn btn-default" data-dismiss="modal">Add Underrun</button>'
                MSG += '<button type="button" class="btn btn-default" data-dismiss="modal">Delete</button>'
				this.stage_modal_buttons.innerHTML = MSG

                var MSG = ''
                this.stage_modal_dynamic.innerHTML = MSG

                $(".modal-dialog").css( "width", "50%" );
				$("#lightbox").modal("show");
			break;
            case 'item_add':
				this.stage_modal_title.innerHTML = "Add Item Detail"
				this.stage_modal_body.innerHTML = $("#hidden_model_item_add").html();
				
				var MSG = ''
                MSG += '<button type="button" class="btn btn-default" data-dismiss="modal">Save</button>'
                MSG += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
				this.stage_modal_buttons.innerHTML = MSG

                var MSG = ''
                this.stage_modal_dynamic.innerHTML = MSG

                $(".modal-dialog").css( "width", "50%" );
				$("#lightbox").modal("show");
			break;
            case 'QCL':
				this.stage_modal_title.innerHTML = "QCL"

                var MSG = ''
                MSG += '<select class="">'
                MSG += '    <option>Construction Contract ######</option>'
                MSG += '    <option>Agreement Contract ######</option>'
                MSG += '    <option>Agreement Contract ######</option>'
                MSG += '</select>'
                MSG += '<select class="">'
                MSG += '    <option>All Items</option>'
                MSG += '    <option>Item Id - Description for this specific item.</option>'
                MSG += '    <option>Item Id - Description for this specific item.</option>'
                MSG += '    <option>Item Id - Description for this specific item.</option>'
                MSG += '    <option>Item Id - Description for this specific item.</option>'
                MSG += '    <option>Item Id - Description for this specific item.</option>'
                MSG += '    <option>Item Id - Description for this specific item.</option>'
                MSG += '</select>'
                this.stage_modal_dynamic.innerHTML = MSG

				var MSG = ''
                MSG += '<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;default&apos;)">Reports</button>'
                MSG += '<button type="button" class="btn btn-default" data-dismiss="modal">Save</button>'
                MSG += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
				this.stage_modal_buttons.innerHTML = MSG

                this.stage_modal_body.innerHTML = $("#hidden_model_item_qcl").html();

                $(".modal-dialog").css( "width", "80%" );
				$("#lightbox").modal("show");
			break;
			case 'estimate':
				this.stage_modal_title.innerHTML = "Details for Estimate ###"

                var MSG = ''
                MSG += '<div class="row">'

                MSG += '	    <div class="col-lg-6">'
                MSG += '	        <div class="col-xs-12 content-table-header">Estimate Details</div>'
                MSG += '	        <div class="col-xs-12 content-table-border">'
                    MSG += '	        <div class="col-xs-12 col-sm-4 widgetTableLabel">Estimate #</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData">###</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-4 widgetTableLabel">Current Completion Date</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData"><input type="text" class="form-control center-text" value="mm/dd/yyyy" /></div>'
                    MSG += '	        <div class="col-xs-12 col-sm-4 widgetTableLabel">Estimate Type</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData">'
                            MSG += '        <select class="form-control widget-form-control">'
		                    MSG += '            <option> - Select - </option>'
		                    MSG += '		</select>'
                    MSG += '	        </div>'
                    MSG += '	        <div class="col-xs-12 col-sm-4 widgetTableLabel">Period End Date</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData"><input type="text" class="form-control center-text" value="mm/dd/yyyy" /></div>'
                    MSG += '	        <div class="col-xs-12 col-sm-4 widgetTableLabel">Estimate Payment Condition</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData">'
                            MSG += '        <select class="form-control widget-form-control">'
		                    MSG += '            <option> - Select - </option>'
		                    MSG += '		</select>'
                    MSG += '	        </div>'
                    MSG += '	        <div class="col-xs-12 col-sm-4 widgetTableLabel">Dollar Value %</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData"><input type="text" class="form-control" value="" /></div>'
                    MSG += '	        <div class="col-xs-12 col-sm-4 widgetTableLabel">Total classified employees</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData"><input type="text" class="form-control" value="" /></div>'
                    MSG += '	        <div class="col-xs-12 col-sm-4 widgetTableLabel">Number of Minority Employees</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData"><input type="text" class="form-control" value="" /></div>'
                    MSG += '	        <div class="col-xs-12 col-sm-4 widgetTableLabel">Number of Female Employees</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData"><input type="text" class="form-control" value="" /></div>'
                    MSG += '	        <div class="col-xs-12 col-sm-4 widgetTableLabel">Payroll Certified</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData">'
                            MSG += '        <select class="form-control widget-form-control">'
		                    MSG += '            <option>No</option>'
		                    MSG += '            <option>Yes</option>'
		                    MSG += '		</select>'
                    MSG += '	        </div>'
                    MSG += '	        <div class="col-xs-12 col-sm-4 widgetTableLabel">Sent to Contractor</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData">'
                            MSG += '        <select class="form-control widget-form-control">'
		                    MSG += '            <option>No</option>'
		                    MSG += '            <option>Yes</option>'
		                    MSG += '		</select>'
                    MSG += '	        </div>'
                    MSG += '	    </div>'
                MSG += '	    </div>'
                MSG += '	    <div class="col-lg-6 box-border">'
                    MSG += '        <div class="col-xs-12 content-table-header">Field Dates</div>'
                    MSG += '        <div class="col-xs-12 content-table-border">'
                    MSG += '	        <div class="col-xs-12 col-sm-4 widgetTableLabel">Date Sent to Contractor</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData"><input type="text" class="form-control center-text" value="mm/dd/yyyy" /></div>'
                    MSG += '	        <div class="col-xs-12 col-sm-4 widgetTableLabel">Contractor Signed on</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData"><input type="text" class="form-control center-text" value="mm/dd/yyyy" /></div>'
                    MSG += '	        <div class="col-xs-12 col-sm-4 widgetTableLabel">Signed by RE</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData"><input type="text" class="form-control center-text" value="mm/dd/yyyy" /></div>'
                    MSG += '	        <div class="col-xs-12 col-sm-4 widgetTableLabel">Signed by FRE</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData"><input type="text" class="form-control center-text" value="mm/dd/yyyy" /></div>'
                    MSG += '	    </div>'
                    MSG += '        <div class="col-xs-12 content-table-header">District Dates</div>'
                    MSG += '        <div class="col-xs-12 content-table-border">'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableLabel">From Field</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData"><input type="text" class="form-control center-text" value="mm/dd/yyyy" /></div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableLabel">To DHD</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData"><input type="text" class="form-control center-text" value="mm/dd/yyyy" /></div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableLabel">From DHD</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData"><input type="text" class="form-control center-text" value="mm/dd/yyyy" /></div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableLabel">To HQ</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData"><input type="text" class="form-control center-text" value="mm/dd/yyyy" /></div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableLabel">From HQ</div>'
                    MSG += '	        <div class="col-xs-12 col-sm-2 widgetTableData"><input type="text" class="form-control center-text" value="mm/dd/yyyy" /></div>'
                    MSG += '	    </div>'
                MSG += '	    </div>'

                MSG += '	<div class="col-xs-12 right-text">'
                MSG += '        <button type="button" class="btn btn-default" style="margin: 0px 0px 3px 0px;" data-dismiss="modal">Attach Payslip</button>'
                MSG += '        <button type="button" class="btn btn-default" style="margin: 0px 0px 3px 0px;" data-dismiss="modal">Remove Payslip</button>'
                MSG += '	</div>'

                MSG += '	<div class="col-xs-12">'
                MSG += '        <div class="rTable content-table-border">'
                    MSG += '        <div class="rTableRow widgetTable widgetTableHeader">'
                    MSG += '	    	<div class="rTableHead center-text" style="width:120px;">Item #</div>'
                    MSG += '		    <div class="rTableHead" style="width:120px;">Item Description</div>'
		            MSG += '	    	<div class="rTableHead center-text" style="width:120px;">Quantity this Estimate</div>'
		            MSG += '    		<div class="rTableHead right-text" style="width:120px;">Manifold Book</div>'
                    MSG += '    		<div class="rTableHead center-text" style="width:75px;">PC #</div>'
		            MSG += '    		<div class="rTableHead" style="width:400px;">Description & Comments</div>'
		            MSG += '    		<div class="rTableHead">&nbsp;</div>'
		            MSG += '    	</div>'

                    MSG += '    	<div class="rTableRow widgetTable cssTableRow contextMenu_payslip">'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">220.2</div>'
                    MSG += '    		<div class="rTableCellOdd" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">DRAINAGE STRUCTURE REBUILT</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1.8</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">77717-1979</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1</div>'
                    MSG += '    		<div class="rTableCellOdd" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">See Calc book this item</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">&nbsp;</div>'
                    MSG += '    	</div>'
                    MSG += '    	<div class="rTableRow widgetTable cssTableRow contextMenu_payslip">'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">220.6</div>'
                    MSG += '    		<div class="rTableCell" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">SANITARY STRUCTURE REBUILT</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1.7</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">77717-1978</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1</div>'
                    MSG += '    		<div class="rTableCell" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">See Calc book this item</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">&nbsp;</div>'
                    MSG += '    	</div>'
                    MSG += '    	<div class="rTableRow widgetTable cssTableRow contextMenu_payslip">'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">220.7</div>'
                    MSG += '    		<div class="rTableCellOdd" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">SANITARY STRUCTURE ADJUSTED</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">34</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">77717-1977</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1</div>'
                    MSG += '    		<div class="rTableCellOdd" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">See Calc book this item</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">&nbsp;</div>'
                    MSG += '    	</div>'
                    MSG += '    	<div class="rTableRow widgetTable cssTableRow contextMenu_payslip">'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">222.3</div>'
                    MSG += '    		<div class="rTableCell" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">FRAME AND GRATE (OR COVER) MUNICIPAL STANDARD</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">77717-1980</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1</div>'
                    MSG += '    		<div class="rTableCell" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">See Calc book this item</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">&nbsp;</div>'
                    MSG += '    	</div>'
                    MSG += '    	<div class="rTableRow widgetTable cssTableRow contextMenu_payslip">'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">241.18</div>'
                    MSG += '    		<div class="rTableCellOdd" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">18 INCH REINFORCED CONCRETE PIPE</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">10</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">77717-01</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1</div>'
                    MSG += '    		<div class="rTableCellOdd" ondblclick="obj_engine.loadModal(&apos;payment&apos;);"></div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">&nbsp;</div>'
                    MSG += '    	</div>'
                    MSG += '    	<div class="rTableRow widgetTable cssTableRow contextMenu_payslip">'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">358</div>'
                    MSG += '    		<div class="rTableCell" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">GATE BOX ADJUSTED</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">100</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">77717-1976</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1</div>'
                    MSG += '    		<div class="rTableCell" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">See Calc book this item</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">&nbsp;</div>'
                    MSG += '    	</div>'
                    MSG += '    	<div class="rTableRow widgetTable cssTableRow contextMenu_payslip">'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">450.9</div>'
                    MSG += '    		<div class="rTableCellOdd" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">CONTRACTOR QUALITY CONTROL</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">3708.27</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">77717-1992</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1</div>'
                    MSG += '    		<div class="rTableCellOdd" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">See Calc book this item</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">&nbsp;</div>'
                    MSG += '    	</div>'
                    MSG += '    	<div class="rTableRow widgetTable cssTableRow contextMenu_payslip">'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">452</div>'
                    MSG += '    		<div class="rTableCell" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">ASPHALT EMULSION FOR TACK COAT</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1803</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">77717-1993</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1</div>'
                    MSG += '    		<div class="rTableCell" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">Tack slip <br />6/13/16 = 555 Gal <br />6/14/16 = 490 <br />6/15/16 = 370 <br />6/16/16 = 388 <br />Total = 1803 Gallons</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">&nbsp;</div>'
                    MSG += '    	</div>'
                    MSG += '    	<div class="rTableRow widgetTable cssTableRow contextMenu_payslip">'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">453</div>'
                    MSG += '    		<div class="rTableCellOdd" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">HMA JOINT SEALANT</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">13103</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">77717-1994</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1</div>'
                    MSG += '    		<div class="rTableCellOdd" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">See Calc book this item</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">&nbsp;</div>'
                    MSG += '    	</div>'
                    MSG += '    	<div class="rTableRow widgetTable cssTableRow contextMenu_payslip">'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">454.5</div>'
                    MSG += '    		<div class="rTableCell" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">LATEX MODIFICATION OF HMA</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">3684.55</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">77717-1991</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1</div>'
                    MSG += '    		<div class="rTableCell" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">See Calc book this item</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">&nbsp;</div>'
                    MSG += '    	</div>'
                    MSG += '    	<div class="rTableRow widgetTable cssTableRow contextMenu_payslip">'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">455.23</div>'
                    MSG += '    		<div class="rTableCellOdd" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">SUPERPAVE SURFACE COURSE - 12.5 (SSC - 12.5)</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">3584.55</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">77717-1990</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1</div>'
                    MSG += '    		<div class="rTableCellOdd" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">See Calc book this item</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">&nbsp;</div>'
                    MSG += '    	</div>'
                    MSG += '    	<div class="rTableRow widgetTable cssTableRow contextMenu_payslip">'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">851.1</div>'
                    MSG += '    		<div class="rTableCell" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">TRAFFIC CONES FOR TRAFFIC MANAGEMENT</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">4</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">77717-1984</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1</div>'
                    MSG += '    		<div class="rTableCell" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">6/13 thru 6/16/16 = 4 Days</div>'
                    MSG += '    		<div class="rTableCell center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">&nbsp;</div>'
                    MSG += '    	</div>'
                    MSG += '    	<div class="rTableRow widgetTable cssTableRow contextMenu_payslip">'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">854.036</div>'
                    MSG += '    		<div class="rTableCellOdd" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">TEMPORARY PAVING MARKINGS - 6 INCH (TAPE)</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">366.3</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">77717-1995</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">1</div>'
                    MSG += '    		<div class="rTableCellOdd" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">6/13/16 Sta84+00 to 104+00 = 66.3&apos; <br />6/14/16 Sta104+00 to 120+00 = 157&apos; <br />6/15/16 Sta120+00 to 138+00 = 116&apos; <br />6/16/16 Sta138+00 to 147+0 0 = 27&apos; <br />Total = 366.3&apos;</div>'
                    MSG += '    		<div class="rTableCellOdd center-text" ondblclick="obj_engine.loadModal(&apos;payment&apos;);">&nbsp;</div>'
		            MSG += '    	</div>'
                    MSG += '    </div>'
                MSG += '    </div>'
                MSG += '	<div class="col-xs-6">'
                MSG += '        <div class="rTable content-table-border">'
                    MSG += '        <div class="rTableRow widgetTable">'
                    MSG += '	    	<div class="widgetTableLabel right-text" style="width:120px;">Items Hash Total</div>'
                    MSG += '		    <div class="rTableCell" style="width:75px;"><strong>5453.746</strong></div>'
		            MSG += '	    	<div class="widgetTableLabel right-text" style="width:240px;"># of Payslips this Estimate</div>'
		            MSG += '    		<div class="rTableCell" style="width:75px;"><strong>13</strong></div>'
                    MSG += '    		<div class="widgetTableLabel right-text" style="width:125px;">Estimate Value</div>'
		            MSG += '    		<div class="rTableCell" style="width:125px;"><strong>$451,572.87</strong></div>'
		            MSG += '    	</div>'
                MSG += '        </div>'
                MSG += '    </div>'
		        MSG += '</div>'

                this.stage_modal_body.innerHTML = MSG

				var MSG = ''
			    MSG += '<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;default&apos;)">Edit Estimate</button>'
		        MSG += '<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;default&apos;)">Delete Estimate</button>'
                MSG += '<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;default&apos;)">Reports</button>'
                MSG += '<button type="button" class="btn btn-default" onClick="obj_engine.loadModal(&apos;default&apos;)">Save</button>'
                this.stage_modal_buttons.innerHTML = MSG;

                var MSG = ''
                this.stage_modal_dynamic.innerHTML = MSG

                this.arm_context_menus();

				$(".modal-dialog").css( "width", "80%" );
                $("#lightbox").modal("show");
			break;
			case 'payment':
				this.stage_modal_title.innerHTML = '<a class="btn glyphicon glyphicon-circle-arrow-left" style="font-size:1.5em;" href="#" role="button" title="Back to Previous" onclick="obj_engine.go_back();"></a> Payment Detail'
				this.stage_modal_body.innerHTML = this.hidden_model_payment.innerHTML
				
				var MSG = ''
				MSG += '<button type="button" class="btn btn-default" data-dismiss="modal">Save</button>'
                MSG += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
				this.stage_modal_buttons.innerHTML = MSG;

                var MSG = ''
                this.stage_modal_dynamic.innerHTML = MSG

				$(".modal-dialog").css( "width", "80%" );
                $("#lightbox").modal("show");
			break;
			case 'messages':
				
				this.stage_modal_title.innerHTML = "Messages"
				this.stage_modal_body.innerHTML = 'LOAD MESSAGE BODY DETAILS'

                var MSG = ''
				MSG += '<button type="button" class="btn" onClick="obj_engine.show_system_message(&apos;Info&apos;);">Info</button>'
				MSG += '<button type="button" class="btn" onClick="obj_engine.show_system_message(&apos;Success&apos;);">Success</button>'
				MSG += '<button type="button" class="btn" onClick="obj_engine.show_system_message(&apos;Warning&apos;);">Warning</button>'
				MSG += '<button type="button" class="btn" onClick="obj_engine.show_system_message(&apos;Danger&apos;);">Danger</button>'
                this.stage_modal_buttons.innerHTML = MSG;

                var MSG = ''
                this.stage_modal_dynamic.innerHTML = MSG

				$(".modal-dialog").css( "width", "50%" );
                $("#lightbox").modal("show");
			break;
			default:
				this.stage_modal_title.innerHTML = "[Context Title]"
				this.stage_modal_body.innerHTML = "[Context Content]"
				
				var MSG = ''
				MSG += '<button type="button" class="btn" data-dismiss="modal">Close</button>'
				this.stage_modal_buttons.innerHTML = MSG;

                var MSG = ''
                this.stage_modal_dynamic.innerHTML = MSG

                $(".modal-dialog").css( "width", "80%" );
                $("#lightbox").modal("show");
		}
	}
	this.show_system_message = function ( this_message)
	{
		switch (this_message)
		{
			case 'Success':
				$.notify({
					icon: 'glyphicon glyphicon-thumbs-up',
					title: 'Save Successful',
					message: 'Your information has been saved successfully!' 
				},{
					type: "success",
					allow_dismiss: true,
					newest_on_top: true,
					showProgressbar: false,
					placement: {
						from: "top",
						align: "center"
					},
					offset: 20,
					spacing: 10,
					z_index: 100000,
					delay: 3000,
					timer: 1000,
					mouse_over: null,
					animate: {
						enter: 'animated fadeInDown',
						exit: 'animated fadeOutUp'
					},
				});
			break;
			case 'Warning':
				$.notify({
					icon: 'glyphicon glyphicon-exclamation-sign',
					title: 'Are You Sure?',
					message: 'Are you sure you want to Cancel and lose all your unsaved information?' 
				},{
					type: "warning",
					allow_dismiss: true,
					newest_on_top: true,
					showProgressbar: false,
					placement: {
						from: "top",
						align: "center"
					},
					offset: 20,
					spacing: 10,
					z_index: 100000,
					delay: 3000,
					timer: 1000,
					mouse_over: null,
					animate: {
						enter: 'animated fadeInDown',
						exit: 'animated fadeOutUp'
					},
				});
			break;
			case 'Info':
				$.notify({
					icon: 'glyphicon glyphicon-info-sign',
					title: 'Some Information',
					message: 'Here is some general information you should know.' 
				},{
					type: "info",
					allow_dismiss: true,
					newest_on_top: true,
					showProgressbar: false,
					placement: {
						from: "top",
						align: "center"
					},
					offset: 20,
					spacing: 10,
					z_index: 100000,
					delay: 3000,
					timer: 1000,
					mouse_over: null,
					animate: {
						enter: 'animated fadeInDown',
						exit: 'animated fadeOutUp'
					},
				});
			break;
			case 'Danger':
				$.notify({
					icon: 'glyphicon glyphicon-flash',
					title: 'Holy Smokes!',
					message: 'You REALLY need to know about this!!!!' 
				},{
					type: "danger",
					allow_dismiss: true,
					newest_on_top: true,
					showProgressbar: false,
					placement: {
						from: "top",
						align: "center"
					},
					offset: 20,
					spacing: 10,
					z_index: 100000,
					delay: 3000,
					timer: 1000,
					mouse_over: null,
					animate: {
						enter: 'animated fadeInDown',
						exit: 'animated fadeOutUp'
					},
				});
			break;
			default:
			/*
			$.notify({
				// options
				icon: 'glyphicon glyphicon-warning-sign',
				title: 'Bootstrap notify',
				message: 'Turning standard Bootstrap alerts into "notify" like notifications',
				url: 'https://github.com/mouse0270/bootstrap-notify',
				target: '_blank'
			},{
				// settings
				element: 'body',
				position: null,
				type: "info",
				allow_dismiss: true,
				newest_on_top: false,
				showProgressbar: false,
				placement: {
					from: "top",
					align: "right"
				},
				offset: 20,
				spacing: 10,
				z_index: 1031,
				delay: 5000,
				timer: 1000,
				url_target: '_blank',
				mouse_over: null,
				animate: {
					enter: 'animated fadeInDown',
					exit: 'animated fadeOutUp'
				},
				onShow: null,
				onShown: null,
				onClose: null,
				onClosed: null,
				icon_type: 'class',
				template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
					'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
					'<span data-notify="icon"></span> ' +
					'<span data-notify="title">{1}</span> ' +
					'<span data-notify="message">{2}</span>' +
					'<div class="progress" data-notify="progressbar">' +
						'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
					'</div>' +
					'<a href="{3}" target="{4}" data-notify="url"></a>' +
				'</div>' 
			});
			*/
		}

		eval(MSG)

		return true
	}
    this.random_glyphicon_count = 0
    this.random_glyphicon_runs_count = 0
    this.random_glyphicon_qty_count = 0
    this.random_glyphicon = function ( this_column )
    {
        MSG = ''

        if( this_column == 'qty')
        {
            this.random_glyphicon_qty_count++
            switch (this.random_glyphicon_qty_count)
		    {
			    case 3:
                case 4:
                    MSG += '<button type="button" class="btn btn-flag" style="background-color:#0000ff;color:#fff;width:70px;" title="There is an Underrun on this Item.">###</button>'
			    break;
			    case 5:
                case 6:
                    MSG += '<button type="button" class="btn btn-flag" style="background-color:#cc0033;color:#fff;width:70px;" title="There is an Overrun on this Item.">###</button>'
			    break;
			    default:
                    MSG += '###'
            }
        }
        else if( this_column == 'over_under')
        {
            this.random_glyphicon_runs_count++
            switch (this.random_glyphicon_runs_count)
		    {
			    case 2:
                    MSG += '<button type="button" class="btn btn-flag" style="background-color:#0000ff;color:#fff;width:70px;" title="There is an Underrun on this Item.">UND 5%</button>'
			    break;
			    case 3:
                    MSG += '<button type="button" class="btn btn-flag" style="background-color:#cc0033;color:#fff;width:70px;" title="There is an Overrun on this Item.">OVR 12%</button>'
			    break;
			    default:
                    MSG += '&nbsp;'
            }
        }
        else
        {
            this.random_glyphicon_count++
            switch (this.random_glyphicon_count)
		    {
			    case 1:
                    MSG += '<button type="button" class="btn btn-flag" style="width:40px;" title="This Item has one or more payment discrepancies.">PAY</button>'
                    MSG += '<button type="button" class="btn btn-flag" style="width:40px;" title="This Item is classified as Material On Hand">MOH</button>'
			    break;
			    case 3:
                    MSG += '<button type="button" class="btn btn-flag" style="width:40px;" title="A 683 is already in progress for this Item.">683</button>'
			    break;
                case 4:
                    MSG += '<button type="button" class="btn btn-flag" style="width:40px;" title="Last Payslip has been sent for this Item."> RE </button>'
			    break;
                case 5:
                    MSG += '<button type="button" class="btn btn-flag" style="width:40px;" title="This Item has one or more payment discrepancies.">PAY</button>'
			    break;
                case 6:
                    MSG += '<button type="button" class="btn btn-flag" style="width:40px;" title="This Item is an Extra Work Order.">EWO</button>'
			    break;
			    default:
                    MSG += '&nbsp;'
            }
        }

        return MSG
    }
	this.color_table_row = function ()
	{
		if( this.table_row_css == "rTableCell" )
		{
			this.table_row_css = "rTableCellOdd"
		}
		else
		{
			this.table_row_css = "rTableCell"
		}

		return this.table_row_css
	}
	this.arm_context_menus = function ()
	{
		(function ($, window) {
		$.fn.contextMenu = function (settings) {
			return this.each(function () {
				// Open context menu
				$(this).on("contextmenu", function (e) {
					// return native menu if pressing control
					if (e.ctrlKey) return;
					//open menu
					var $menu = $(settings.menuSelector)
						.data("invokedOn", $(e.target))
						.show()
						.css({
							position: "absolute",
							left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
							top: getMenuPosition(e.clientY, 'height', 'scrollTop')
						})
						.off('click')
						.on('click', 'a', function (e) {
							$menu.hide();
                
							var $invokedOn = $menu.data("invokedOn");
							var $selectedMenu = $(e.target);
                        
							settings.menuSelected.call(this, $invokedOn, $selectedMenu);
						});
					return false;
				});

				//make sure menu closes on any click
				$('body').click(function () {
					$(settings.menuSelector).hide();
				});
			});
			function getMenuPosition(mouse, direction, scrollDir) {
				var win = $(window)[direction](),
					scroll = $(window)[scrollDir](),
					menu = $(settings.menuSelector)[direction](),
					position = mouse + scroll;
				// opening menu would pass the side of the page
				if (mouse + menu > win && menu < mouse) 
					position -= menu;
				return position;
			}    

		};
		})(jQuery, window);

		$(".contextMenu_contract").contextMenu({
			menuSelector: "#contextMenu_contract",
			menuSelected: function (invokedOn, selectedMenu) {
				var msg = "You selected the menu item '" + selectedMenu.text() +
					"' on the value '" + invokedOn.text() + "'";
				//alert(msg);
			}
		});
		$(".contextMenu_agreement").contextMenu({
			menuSelector: "#contextMenu_agreement",
			menuSelected: function (invokedOn, selectedMenu) {
				var msg = "You selected the menu item '" + selectedMenu.text() +
					"' on the value '" + invokedOn.text() + "'";
				//alert(msg);
			}
		});
		$(".contextMenu_info").contextMenu({
			menuSelector: "#contextMenu_info",
			menuSelected: function (invokedOn, selectedMenu) {
				var msg = "You selected the menu item '" + selectedMenu.text() +
					"' on the value '" + invokedOn.text() + "'";
				//alert(msg);
			}
		});
		$(".contextMenu_item").contextMenu({
			menuSelector: "#contextMenu_item",
			menuSelected: function (invokedOn, selectedMenu) {
				var msg = "You selected the menu item '" + selectedMenu.text() +
					"' on the value '" + invokedOn.text() + "'";
				//alert(msg);
			}
		});
		$(".contextMenu_estimate").contextMenu({
			menuSelector: "#contextMenu_estimate",
			menuSelected: function (invokedOn, selectedMenu) {
				var msg = "You selected the menu item '" + selectedMenu.text() +
					"' on the value '" + invokedOn.text() + "'";
				//alert(msg);
			}
		});
		$(".contextMenu_payslip").contextMenu({
			menuSelector: "#contextMenu_payslip",
			menuSelected: function (invokedOn, selectedMenu) {
				var msg = "You selected the menu item '" + selectedMenu.text() +
					"' on the value '" + invokedOn.text() + "'";
				//alert(msg);
			}
		});
	}
	this.initialize = function ()
	{
		this.stage_main = document.getElementById("stage_main");

		this.hidden_dashboard_contracts = document.getElementById("hidden_dashboard_contracts");
		this.hidden_dashboard_projections = document.getElementById("hidden_dashboard_projections");
		this.hidden_dashboard_watching = document.getElementById("hidden_dashboard_watching");
		this.hidden_dashboard_add = document.getElementById("hidden_dashboard_add");

		this.stage_list_of_contracts = document.getElementById("stage_list_of_contracts");

		this.stage_details_for_bar_label = document.getElementById("stage_details_for_bar_label");
	    this.stage_contract_details = document.getElementById("stage_contract_details");
		this.stage_estimate_items = document.getElementById("stage_estimate_items");

		this.lightbox = document.getElementById("lightbox");
		this.stage_modal_title = document.getElementById("stage_modal_title");
		this.stage_modal_buttons = document.getElementById("stage_modal_buttons");
		this.stage_modal_dynamic = document.getElementById("stage_modal_dynamic");
        this.stage_modal_body = document.getElementById("stage_modal_body");

		this.hidden_model_payment = document.getElementById("hidden_model_payment");
		this.hidden_model_geo = document.getElementById("hidden_model_geo");

		this.stage_field_2016E = document.getElementById("field_2016E");
		this.stage_field_2016EF = document.getElementById("field_2016EF");
		this.stage_field_2016ES = document.getElementById("field_2016ES");
		this.stage_field_2016EM = document.getElementById("field_2016EM");
		this.stage_field_201601 = document.getElementById("field_201601");
		this.stage_field_201602 = document.getElementById("field_201602");
		this.stage_field_201603 = document.getElementById("field_201603");
		this.stage_field_201604 = document.getElementById("field_201604");
		this.stage_field_201605 = document.getElementById("field_201605");
		this.stage_field_201606 = document.getElementById("field_201606");
		this.stage_field_201607 = document.getElementById("field_201607");
		this.stage_field_201608 = document.getElementById("field_201608");
		this.stage_field_201609 = document.getElementById("field_201609");
		this.stage_field_201610 = document.getElementById("field_201610");
		this.stage_field_201611 = document.getElementById("field_201611");
		this.stage_field_201612 = document.getElementById("field_201612");
		this.stage_field_201601F = document.getElementById("field_201601F");
		this.stage_field_201602F = document.getElementById("field_201602F");
		this.stage_field_201603F = document.getElementById("field_201603F");
		this.stage_field_201604F = document.getElementById("field_201604F");
		this.stage_field_201605F = document.getElementById("field_201605F");
		this.stage_field_201606F = document.getElementById("field_201606F");
		this.stage_field_201607F = document.getElementById("field_201607F");
		this.stage_field_201608F = document.getElementById("field_201608F");
		this.stage_field_201609F = document.getElementById("field_201609F");
		this.stage_field_201610F = document.getElementById("field_201610F");
		this.stage_field_201611F = document.getElementById("field_201611F");
		this.stage_field_201612F = document.getElementById("field_201612F");
		this.stage_field_201601S = document.getElementById("field_201601S");
		this.stage_field_201602S = document.getElementById("field_201602S");
		this.stage_field_201603S = document.getElementById("field_201603S");
		this.stage_field_201604S = document.getElementById("field_201604S");
		this.stage_field_201605S = document.getElementById("field_201605S");
		this.stage_field_201606S = document.getElementById("field_201606S");
		this.stage_field_201607S = document.getElementById("field_201607S");
		this.stage_field_201608S = document.getElementById("field_201608S");
		this.stage_field_201609S = document.getElementById("field_201609S");
		this.stage_field_201610S = document.getElementById("field_201610S");
		this.stage_field_201611S = document.getElementById("field_201611S");
		this.stage_field_201612S = document.getElementById("field_201612S");
		this.stage_field_201601M = document.getElementById("field_201601M");
		this.stage_field_201602M = document.getElementById("field_201602M");
		this.stage_field_201603M = document.getElementById("field_201603M");
		this.stage_field_201604M = document.getElementById("field_201604M");
		this.stage_field_201605M = document.getElementById("field_201605M");
		this.stage_field_201606M = document.getElementById("field_201606M");
		this.stage_field_201607M = document.getElementById("field_201607M");
		this.stage_field_201608M = document.getElementById("field_201608M");
		this.stage_field_201609M = document.getElementById("field_201609M");
		this.stage_field_201610M = document.getElementById("field_201610M");
		this.stage_field_201611M = document.getElementById("field_201611M");
		this.stage_field_201612M = document.getElementById("field_201612M");

		this.generate_list_of_contracts();
		this.generate_random_contract_items();
		this.generate_random_contract_estimates();

		this.click_on_contract_list_cell ( contract_list[0]["id"] )
	}
}

var obj_engine = new CONSTRUCTOR_faux_engine();