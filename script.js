(function(){

	"use strict";

	var registers = [
		'Begin',
		'Tussen',
		'Eind'
	];

	var amounts = [100, 50, 20, 10, 5, 2, 1, 0.50, 0.20, 0.10, 0.05];

	var turnovers = [
		{
			name: '16-',
			id: 'Begin',
			start: 'Begin',
			end: 'Tussen'
		},
		{
			name: '16+',
			id: 'Eind',
			start: 'Tussen',
			end: 'Eind'
		}
	];

	var Entity = {

		init: function(){

			this.build();
		},

		build: function(){

			this.buildRegisters();
			this.buildTurnovers();
		},

		buildRegisters: function(){

			var i;
			var $register;

			for(i = 0; i < registers.length; i += 1){

				$register = this.buildRegister(registers[i]);
				$register.inject($('registers-placeholder'));
			}
		},

		buildRegister: function(register){

			var $register = $('example-table').clone();
			var $top = $('example-register-top').clone();
			var $row;
			var i;
			var $bottom = $('example-register-bottom').clone();

			var calculateTotal = function(){

				var totals = $register.getElements('.RowTotal');
				var i;
				var total = 0;
				var $total = $bottom.getElement('.Total');

				for(i = 0; i < totals.length; i += 1){

					total += totals[i].get('data-total').toFloat();
				}

				$total.set('data-amount', total);
				$total.set('text', '€ ' + total);

				Entity.calculateTurnover();
			};

			$register.removeClass('Hidden');
			$register.set('id', register + '-register');

			$top.removeClass('Hidden');
			$top.getElement('.Name').set('text', register + 'kassa');
			$top.inject($register);

			for(i = 0; i < amounts.length; i += 1){

				$row = this.buildRegisterRow(amounts[i], calculateTotal);
				$row.inject($register);
			}

			$bottom.removeClass('Hidden');
			$bottom.inject($register);

			return $register;
		},

		buildRegisterRow: function(amount, calculateTotal){

			var $row = $('example-register-row').clone();
			var $amount = $row.getElement('.Amount');
			var $input = $row.getElement('input');
			var $total = $row.getElement('.RowTotal');
			$row.removeClass('Hidden');
			$amount.set('text', '€ ' + amount);

			$input.addEvent('keyup', function(){

				var total = $input.value * amount;
				$total.set('data-total', total);
				$total.set('text', '€ ' + total);

				calculateTotal();
			});

			return $row;
		},

		buildTurnovers: function(){

			var i;
			var $turnover;
			var $total_turnover;

			for(i = 0; i < turnovers.length; i += 1){

				$turnover = this.buildTurnover(turnovers[i]);
				$turnover.inject($('turnovers-placeholder'));

				$total_turnover = this.buildTotalTurnover(turnovers[i]);
				$total_turnover.inject($('total-turnover-placeholder'));
			}
		},

		buildTurnover: function(turnover){

			var $turnover = $('example-table').clone();
			var $top = $('example-turnover-top').clone();
			var $start = $('example-turnover-row').clone();
			var $end = $('example-turnover-row').clone();
			var $total = $('example-turnover-bottom').clone();

			$top.getElement('.Name').set('text', 'Omzet ' + turnover.name);
			$top.removeClass('Hidden');
			$top.inject($turnover);

			$end.getElement('.Name').set('text', turnover.end + 'kassa:');
			$end.getElement('.RowTotal').addClass('End');
			$end.removeClass('Hidden');
			$end.inject($turnover);

			$start.getElement('.Name').set('text', turnover.start + 'kassa:');
			$start.getElement('.RowTotal').addClass('Start');
			$start.removeClass('Hidden');
			$start.inject($turnover);

			$total.removeClass('Hidden');
			$total.inject($turnover);

			$turnover.set('id', turnover.id + '-turnover');
			$turnover.removeClass('Hidden');

			return $turnover;
		},

		buildTotalTurnover: function(turnover){

			var $total_turnover = $('example-total-turnover-row').clone();
			$total_turnover.getElement('.Name').set('text', 'Omzet ' + turnover.name + ':');
			$total_turnover.getElement('.Amount').set('id', turnover.id + '-total-turnover');
			return $total_turnover;
		},

		calculateTurnover: function(){

			var i;
			var turnover;
			var $turnover;
			var start;
			var end;
			var total;
			var $total;
			var $total_turnover;

			for(i = 0; i < turnovers.length; i += 1){

				turnover = turnovers[i];

				$turnover = $(turnover.id + '-turnover');

				start = $(turnover.start + '-register').getElement('.Total').get('data-amount');
				end = $(turnover.end + '-register').getElement('.Total').get('data-amount');
				total = end - start;

				$turnover.getElement('.Start').set('text', '€ ' + start);
				$turnover.getElement('.End').set('text', '€ ' + end);

				$total = $turnover.getElement('.Total');
				$total.set('text', '€ ' + total);
				$total.set('data-amount', total);

				$total_turnover = $(turnover.id + '-total-turnover');
				$total_turnover.set('text', '€ ' + total);
				$total_turnover.set('data-amount', total);
			}

			Entity.calculateTotalTurnover();
		},

		calculateTotalTurnover: function(){

			var i;
			var turnover;
			var $turnover;
			var amount;
			var total = 0;

			for(i = 0; i < turnovers.length; i += 1){

				turnover = turnovers[i];
				$turnover = $(turnover.id + '-total-turnover');
				amount = $turnover.get('data-amount');
				total += amount.toFloat();
			}

			$('Turnover').set('text', '€ ' + total);
			$('Turnover').set('data-amount', total);
		}
	};

	$(document).addEvent('domready', function(){

		Entity.init();
	});
}());



