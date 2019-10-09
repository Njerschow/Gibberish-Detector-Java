package com.paypal.gibberish.serviceprovider;


import java.util.List;

public class ResultObject {
	List <NameObject> names;
	public List<NameObject> getNames() {
		return names;
	}
	public void setNames(List<NameObject> names) {
		this.names = names;
	}
	public double getThreshold() {
		return threshold;
	}
	public void setThreshold(double threshold) {
		this.threshold = threshold;
	}
	
	double threshold;
	
}
class NameObject {
	String name;
	double gibberishScore;
	boolean isGibberish;
	public boolean isGibberish() {
		return isGibberish;
	}
	public void setGibberish(boolean isGibberish) {
		this.isGibberish = isGibberish;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public double getGibberishScore() {
		return gibberishScore;
	}
	public void setGibberishScore(double gibberishScore) {
		this.gibberishScore = gibberishScore;
	}
}