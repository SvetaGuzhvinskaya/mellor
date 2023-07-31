'use strict';

/* eslint-disable no-unused-vars */

var $window = $(window);
var $document = $(document);
var $html = $(document.documentElement);
var $body = $(document.body);

try {
	Typekit.load({
		async: true
	});
} catch (e) {}

$('.mobile-menu-toggle').click(function() {
	$('#container, body, html').toggleClass('menu-open');
	$('.mobile-navigation').toggleClass('open');
	return false;
});
// form styler
var $jsFormStyle = $('.js-input');
var $jsChecked = $('.js-checked');
var $jsCheckedInput = $('.jq-checkbox');
$jsFormStyle.styler();
$jsChecked.change(function() {
	if ($(this).children($jsCheckedInput).is('.checked')) {
		$(this).addClass('checked');
	} else {
		$(this).removeClass('checked');
	}
});
$("#fuel_cost").inputmask("9.9", {
	placeholder: "_._"
});
jQuery(document).ready(function() {
	var mil = {
		name: 'mil',
		min: 10000,
		max: 100000,
		value: 0,
		step: 1000,
		units: "",
		cost: 24.95
	};
	var fuel = {
		name: 'fuel',
		min: 1,
		max: 0.6,
		value: 0,
		step: 0.1,
		units: " GB",
		cost: 6.95
	};
	var vehi = {
		name: 'vehi',
		min: 1,
		max: 25,
		value: 0,
		step: 1,
		units: "",
		cost: 0.17
	};

	var Strata = {
		Mileage_Per_Gallon: 20,
		Maintenace_costs_per_mile: 0.04793081,
		Other_fixed_maintenance_costs: 12704.51
	};
	var LargeBus = {
		Mileage_Per_Gallon: 10,
		Maintenace_costs_per_mile: 0.0844978,
		Other_fixed_maintenance_costs: 21456.71

		// Mileage
	};
	initQuoteSlider(mil);
	//initQuoteSlider(fuel);
	initQuoteSlider(vehi);

	new BeerSlider(document.getElementById("slider-values-fuel"), {
		start: 1
	});
	setTimeout(function() {
		initFuel();
	}, 500);

	jQuery("#fuel_cost").change(function() {
		initFuel();
		calculate_price();
	});

	function initFuel() {

		var fuel_cost = jQuery("#fuel_cost").val();
		var val_slider = (fuel_cost - 1) * 100 / fuel.max;
		jQuery("#slider-values-" + fuel.name + " .beer-handle").css("left", val_slider + "%");
		jQuery("#slider-values-" + fuel.name + "-reval").attr("style", "width:" + val_slider + "%").css("width", val_slider + "%");
	}

	function initQuoteSlider(sl) {

		var val_slider_percents = sl.value * 100 / sl.max;
		new BeerSlider(document.getElementById("slider-values-" + sl.name), {
			start: 1
		});

		setTimeout(function() {
			jQuery("#slider-values-" + sl.name + " .beer-handle").css("left", val_slider_percents + "%");
			jQuery("#slider-values-" + sl.name + "-reval").attr("style", "width:" + val_slider_percents + "%").css("width", val_slider_percents + "%");
		}, 500);

		jQuery("#slider-number-" + sl.name).slider({
			//min: 0, //sl.min
			max: sl.max,
			range: "min",
			value: sl.value,
			step: sl.step,
			slide: function slide(event, ui) {
				jQuery("#label-number-" + sl.name).html(ui.value + sl.units);
				jQuery("#number-" + sl.name).val(ui.value);

				var val_slider = ui.value * 100 / sl.max;
				//setBeerSlider(val_slider, 'slider-values-mil');
				jQuery("#slider-values-" + sl.name + " .beer-handle").css("left", val_slider + "%");
				jQuery("#slider-values-" + sl.name + "-reval").attr("style", "width:" + val_slider + "%").css("width", val_slider + "%");

				calculate_price();
			},
			stop: function stop(event, ui) {
				jQuery("#label-number-" + sl.name).html(ui.value + sl.units);
				jQuery("#number-" + sl.name).val(ui.value);
				calculate_price();
			}
		});
		jQuery("#label-number-" + sl.name).html(jQuery("#slider-number-" + sl.name).slider("value") + sl.units);
		jQuery("#number-" + sl.name).val(jQuery("#slider-number-" + sl.name).slider("value"));
	}

	function calculate_price() {

		var formatter = new Intl.NumberFormat('en-US', {
			style: 'decimal',
			minimumFractionDigits: 2
		});

		var fuel_cost = jQuery("#fuel_cost").val();
		var Mileage = jQuery("#number-mil").val();
		var Number_of_vehicles = jQuery("#number-vehi").val();

		Strata.Gallons_used = Mileage / Strata.Mileage_Per_Gallon;
		Strata.Fuel = fuel_cost * 4.54 * Strata.Gallons_used * 12 * 1.1496286;
		Strata.BSOG = -0.0965 * Mileage * 12;
		Strata.Maintenance_costs_mileage_dependent = Strata.Maintenace_costs_per_mile * Mileage * 12;
		Strata.Total_cost_saving = Strata.Fuel + Strata.BSOG + Strata.Maintenance_costs_mileage_dependent + Strata.Other_fixed_maintenance_costs;
		Strata.Total_cost_saving_vehi = Strata.Total_cost_saving * Number_of_vehicles;

		LargeBus.Gallons_used = Mileage / LargeBus.Mileage_Per_Gallon;
		LargeBus.Fuel = fuel_cost * 4.54 * LargeBus.Gallons_used * 12 * 1.1496286;
		LargeBus.BSOG = -0.0965 * Mileage * 12;
		LargeBus.Maintenance_costs_mileage_dependent = LargeBus.Maintenace_costs_per_mile * Mileage * 12;
		LargeBus.Total_cost_saving = LargeBus.Fuel + LargeBus.BSOG + LargeBus.Maintenance_costs_mileage_dependent + LargeBus.Other_fixed_maintenance_costs;
		LargeBus.Total_cost_saving_vehi = LargeBus.Total_cost_saving * Number_of_vehicles;

		var total_saving = LargeBus.Total_cost_saving_vehi - Strata.Total_cost_saving_vehi;
		var annual_saving = total_saving / 12;

		//jQuery("#strata_gallons_used").html(Mileage+' / '+ Strata.Mileage_Per_Gallon+' = ' +Strata.Gallons_used);
		//jQuery("#strata_fuel").html(Strata.Fuel);

		jQuery("#strata_total_cost_saving").html(formatter.format(Strata.Total_cost_saving_vehi));
		jQuery("#largebus_total_cost_saving").html(formatter.format(LargeBus.Total_cost_saving_vehi));

		//jQuery("#total_saving").html("&#163;" + total_saving.toFixed(2));
		jQuery("#total_saving").html(formatter.format(total_saving));
		jQuery("#annual_saving").html(formatter.format(annual_saving));

		//largebus_total_cost_saving

		//alert('function calculate_price()');
		/*
		var total_cost = 0;
		var total_cost_discount = 0;
		var number_mil = jQuery("#number-mil").val();
		var number_fuel = jQuery("#number-fuel").val();
		var number_hdd = jQuery("#number-hdd").val();
		var number_bandwidth = jQuery("#bandwidth").val();
			
		total_cost = number_mil*mil.cost + number_fuel*fuel.cost + number_hdd*hdd.cost + number_bandwidth*bandwidth.cost;									
		total_cost_discount = total_cost - total_cost*0.2;
			
		jQuery("#cost").html("£ " + total_cost.toFixed(2));
		jQuery("#cost_commitment").html("£ " + total_cost_discount.toFixed(2));
			
		jQuery("#monthly_cost").val("£ " + total_cost.toFixed(2));
		jQuery("#annual_cost").val("£ " + total_cost_discount.toFixed(2));
		*/
	}
});
