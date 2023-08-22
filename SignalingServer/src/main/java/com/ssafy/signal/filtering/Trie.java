package com.ssafy.signal.filtering;

import java.util.ArrayDeque;
import java.util.List;
import java.util.Queue;

import lombok.Getter;

@Getter
public class Trie {

	private Node root = new Node();
	
	public void addNewWord(String s) {
		char[] charArray = s.toCharArray();
		Node current = root;
		Loop1: for (char c : charArray) {
			for(Node node : current.getChildren()) {
				if(node.getValue() == c) {
					current = node;
					continue Loop1;
				}
			}
			Node temp = new Node();
			temp.setValue(c);
			current.addChildren(temp);
			current = temp;
		}
		current.setOutput(true);
	}
	
	public void findFail() {
		Queue<Node> queue = new ArrayDeque<Node>();
		queue.add(root);
		while(queue.size() > 0) {
			Node temp = queue.poll();
			List<Node> list = temp.getChildren();
			for (Node node : list) {
				if(temp == root) {
					node.setFailure(root);
				}
				else {
					failTrack(temp.getFailure(), node);
				}
				queue.add(node);
			}
		}
	}
	
	public void failTrack(Node check, Node me) {
		List<Node> list = check.getChildren();
		for (Node node : list) {
			if(node.getValue() == me.getValue()) {
				me.setFailure(node);
				return;
			}
		}
		if(check.getFailure() == null) {
			me.setFailure(check);
			return;
		}
		failTrack(check.getFailure(), me);
	}
	
	public char[] match(Node node, char[] charArray, int index, int streak) {
		if(index == charArray.length) {
			return charArray;
		}
		for (Node n : node.getChildren()) {
			if(n.getValue() == charArray[index]) {
				if(n.isOutput()) {
					for (int i = 0; i < streak+1; i++) {
						charArray[index - i] = '*';
					}
				}
				return match(n, charArray, index+1, streak+1);
			}
		}
		if(node == root) {
			return match(root, charArray, index+1, 0);
		}
		
		return match(node.getFailure(), charArray, index, 0);
	}
}
