package com.ssafy.signal.filtering;

import java.util.ArrayList;
import java.util.List;


public class Node {

	private char value;
	private List<Node> children;
	private Node failure;
	private boolean output;
	
	public Node() {
		children = new ArrayList<Node>();
	}
	public char getValue() {
		return value;
	}
	public void setValue(char value) {
		this.value = value;
	}
	public List<Node> getChildren() {
		return children;
	}
	public void setChildren(List<Node> children) {
		this.children = children;
	}
	public Node getFailure() {
		return failure;
	}
	public void setFailure(Node failure) {
		this.failure = failure;
	}
	public boolean isOutput() {
		return output;
	}
	public void setOutput(boolean output) {
		this.output = output;
	}
	public void addChildren(Node node) {
		this.children.add(node);
	}
}
