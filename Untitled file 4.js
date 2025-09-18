<View>
  <Text>Buy Coins</Text>
    <Button title="Pay with Easypaisa" onPress={()=>buy('easypaisa')} />
      <Button title="Pay with JazzCash" onPress={()=>buy('jazzcash')} />
        <Button title="Pay with Bank Transfer" onPress={()=>buy('bank')} />
        </View>