package com.voiceTodo.voiceTodo.util;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.CharArraySet;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.core.StopFilter;
import org.apache.lucene.analysis.core.WhitespaceTokenizer;
import org.apache.lucene.analysis.en.PorterStemFilter;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;

import java.io.IOException;
import java.io.StringReader;
import java.util.Set;

public class myAnalyzer extends Analyzer {

    private final CharArraySet stopWords;
    private final Set<String> protectedTerms;

    myAnalyzer(CharArraySet stopWords, Set<String> protectedTerms) {
        this.stopWords = stopWords;
        this.protectedTerms = protectedTerms;
    }


    @Override
    protected TokenStreamComponents createComponents(String s) {

        WhitespaceTokenizer tokenizer= new WhitespaceTokenizer();
        TokenStream tokenStream=new StopFilter(tokenizer,stopWords);
        tokenStream=new PorterStemFilter(tokenStream);
        return new TokenStreamComponents(tokenizer,tokenStream);
    }

    public String stem(String text) {
        StringBuilder result = new StringBuilder();
        try (TokenStream tokenStream = tokenStream("dummyField", new StringReader(text))) {
            CharTermAttribute charTermAttr = tokenStream.addAttribute(CharTermAttribute.class);
            tokenStream.reset();

            while (tokenStream.incrementToken()) {
                result.append(charTermAttr.toString()).append(" ");
            }
            tokenStream.end();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result.toString().trim();
    }
}
