package com.paypal.gibberish.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.paypal.gibberish.serviceprovider.GibberishNameDetector;
import com.paypal.gibberish.serviceprovider.Names;
import com.paypal.gibberish.serviceprovider.ResultObject;


@RestController
public class GibberishNameDetectorController {
	Logger logger = LoggerFactory.getLogger(GibberishNameDetectorController.class);
	@RequestMapping("/")
	@ResponseBody
	public ResultObject startup() {
		return GibberishNameDetector.demo();
	}
	@RequestMapping("/demo")
	@ResponseBody
	public ResultObject demo() {
		return GibberishNameDetector.demo();
	}

	@RequestMapping(value = "/gibberishScore", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResultObject getGibberishScoreWithThreshold(@RequestParam(value = "threshold", required=false) final Double threshold, @RequestBody Names names) {

		return GibberishNameDetector.getResult(threshold, names.getNames());
	}

}