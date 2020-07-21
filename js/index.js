let Main = (function () {
	let _el_window = null;
	let _el_inputText = null;
	let _el_positionText = null;
	let _el_color = null;
	let _el_boundary = null;
	let _el_controls = null;
	let _el_resetButton = null;
	let _el_background = null;
	let _b_isDragging = false;
	let _b_isStartingPosition = true;
	let _num_initialCusorX = null;
	let _num_initialCusorY = null;
	let _num_initialMoveBoxPos = null;

	let _Init = () => {
		_el_window = $(window);
		_el_inputText = $("#text");
		_el_positionText = $("#position");
		_el_color = $("#color");
		_el_moveBox = $("#move-box");
		_el_boundary = $(".movement-boundary");
		_el_controls = $(".controls");
		_el_resetButton = $("#reset");
		_el_background = $("#background");

		_el_inputText.on("input", _OnTextChange);
		_el_color.on("input", _OnTextChange);

		_el_moveBox.on("mousedown touchstart", _OnMouseDown);
		_el_moveBox.on("mouseup touchend touchcancel", _OnMouseUp);
		_el_moveBox.on("mousemove touchmove", _OnMouseMove);

		_el_window.on("resize", _OnResize);
		_el_window.on("blur", _OnMouseUp);
		_el_window.on("mouseup", _OnMouseUp);

		_el_resetButton.on("click", _OnResetClick);
		_el_background.on("input", _OnBackgroundChange);

		_SetBoxToCenter();
	};

	let _OnTextChange = () => {
		let text = _el_inputText.val();
		if (text.length <= 0) {
			text = _el_inputText.attr("placeholder");
		}

		let color = _el_color.val();
		_el_moveBox.css("color", color);
		_el_moveBox.text(text);
	};

	let _OnMouseDown = (ev) => {
		if (ev.originalEvent.touches) {
			ev = ev.originalEvent.touches[0];
		}

		_b_isDragging = true;

		_num_initialMoveBoxPos = _el_moveBox.offset();
		_num_initialCusorX = ev.pageX;
		_num_initialCusorY = ev.pageY;

		_UpdateText();
	};

	let _OnMouseUp = () => {
		_b_isDragging = false;

		_num_initialMoveBoxPos = null;
		_num_initialCusorX = null;
		_num_initialCusorY = null;

		_UpdateText();
	};

	let _OnMouseMove = (ev) => {
		if (!_b_isDragging) {
			return;
		}

		_b_isStartingPosition = false;
		if (ev.originalEvent.touches) {
			ev = ev.originalEvent.touches[0];
		}

		let moveX = ev.pageX - _num_initialCusorX;
		let moveY = ev.pageY - _num_initialCusorY;

		let posX = _num_initialMoveBoxPos.left + moveX;
		let posY = _num_initialMoveBoxPos.top + moveY - 15;

		let percentageX = (posX / _el_window.width()) * 100;
		let percentageY = (posY / _el_window.height()) * 100;

		_el_moveBox.css("left", percentageX + "%");
		_el_moveBox.css("top", percentageY + "%");

		_UpdateText();
	};

	let _OnResize = () => {
		if (_el_window.height() === window.screen.height) {
			_el_controls.css("display", "none");
		} else {
			_el_controls.css("display", "");
		}

		if (_b_isStartingPosition) {
			_SetBoxToCenter();
		}

		_UpdateText();
	};

	let _UpdateText = () => {
		if (_b_isStartingPosition) {
			return;
		}

		let moveBoxOffset = _el_moveBox.offset();
		let boundaryOffset = _el_boundary.offset();

		let boundarySize = _GetBoundarySize();
		let X = (moveBoxOffset.left - boundaryOffset.left) / boundarySize.width;
		let Y = (moveBoxOffset.top - boundaryOffset.top) / boundarySize.height;

		_el_positionText.html("X: " + X.toFixed(4) + "<br>Y: " + Y.toFixed(4));
	};

	let _GetBoundarySize = () => {
		return {
			height: _el_window.height() - (_el_window.height() === window.screen.height ? 0 : _el_controls.height()),
			width: _el_boundary.width()
		};
	};

	let _OnResetClick = () => {
		_b_isStartingPosition = true;
		_el_positionText.html("X: -1.0000<br>Y: -1.0000");

		_SetBoxToCenter();
		_OnMouseUp();
		_OnResize();
	};

	let _OnBackgroundChange = () => {
		_el_boundary.css("background-image", "url(" + _el_background.val() + ")");
	};

	let _SetBoxToCenter = () => {
		let boundarySize = _GetBoundarySize();
		_el_moveBox.css("top", (boundarySize.height / 2) + (_el_window.height() === window.screen.height ? 0 : _el_controls.height()));
		_el_moveBox.css("left", boundarySize.width / 2);
	};

	return {
		Init: _Init,
		OnTextChange: _OnTextChange
	};
})();

(function () {
	$(document).ready(Main.Init);
})();
